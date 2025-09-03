import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import axios from "axios";
import dayjs from "dayjs";

import { CONFIG } from "src/config-global";

// ---- 类型增强：给 axios 的 config 增加一个开关字段 ----
declare module "axios" {
  export interface AxiosRequestConfig {
    /** 标记该请求不参与 refresh 拦截与全局 loading 统计 */
    skipAuthRefresh?: boolean;
  }
}

const api = axios.create({
  baseURL: CONFIG.apiUrl,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];
let loadingCount = 0;
let preRefreshTimer: ReturnType<typeof setTimeout> | null = null;

// 外部可注册“登录失效”回调（例如把状态置为 unauthenticated）
let onAuthInvalid: (() => void) | null = null;
export function setOnAuthInvalid(handler: (() => void) | null) {
  onAuthInvalid = handler;
}

// —— 可选：全局 loading / 错误 —— //
const setGlobalLoading = (show: boolean) => {
  // 这里接入你的全局 loading
  console.log("global loading:", show);
};
const showGlobalError = (msg: string) => {
  console.error(msg);
};

// 请求拦截器
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.skipAuthRefresh) {
    loadingCount++;
    setGlobalLoading(true);
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    if (!res.config.skipAuthRefresh) {
      loadingCount--;
      if (loadingCount <= 0) setGlobalLoading(false);
    }
    return res;
  },
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest?.skipAuthRefresh) {
      loadingCount--;
      if (loadingCount <= 0) setGlobalLoading(false);
    }

    // 如果是 /auth/refresh 自己失败，直接通知失效，避免死循环
    if (originalRequest?.url?.includes("/auth/refresh")) {
      onAuthInvalid?.();
      return Promise.reject(error);
    }

    // 仅对 401 触发即时刷新（兜底），且每个请求只重试一次
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const resp = await api.post("/auth/refresh", null, { skipAuthRefresh: true });
          isRefreshing = false;
          onRefreshed();

          // ✅ 立即刷新成功后，也要重新安排下一次预刷新
          const nextExp = await extractNextExp(resp);
          if (nextExp) {
            await schedulePreRefresh(nextExp);
          }
        } catch (e) {
          isRefreshing = false;
          onRefreshed();
          onAuthInvalid?.(); // 通知上层：登录已失效
          return Promise.reject(e);
        }
      }

      // 等待刷新完成后重放原请求
      return new Promise((resolve) => {
        refreshSubscribers.push(() => resolve(api(originalRequest)));
      });
    }

    showGlobalError(error.message || "请求失败");
    return Promise.reject(error);
  }
);

// 通知队列中的请求：刷新完成
function onRefreshed() {
  refreshSubscribers.forEach(cb => cb());
  refreshSubscribers = [];
}

// 从响应里提取 exp（支持 data.exp 或 响应头 x-access-exp）
async function extractNextExp(resp?: any): Promise<number | undefined> {
  let exp: number | undefined =
    resp?.data?.exp ??
    (resp?.headers?.["x-access-exp"]
      ? Number(resp.headers["x-access-exp"])
      : undefined);

  if (!exp) {
    // 兜底走 /api/me 再拿一次（跳过拦截器以防递归）
    try {
      const me = await api.get("/api/me", { skipAuthRefresh: true });
      exp = me.data?.exp;
    } catch {
      // ignore
    }
  }
  return exp;
}

// —— 预刷新：会在成功后自动再次 schedule —— //
export async function schedulePreRefresh(exp: number) {
  // 清理旧的定时器，避免重复 schedule
  if (preRefreshTimer) {
    clearTimeout(preRefreshTimer);
    preRefreshTimer = null;
  }

  const now = dayjs().unix();
  const delayMs = (exp - now - 60) * 1000; // 提前 60 秒
  if (delayMs <= 0) return;

  preRefreshTimer = setTimeout(async () => {
    try {
      const resp = await api.post("/auth/refresh", null, { skipAuthRefresh: true });
      const nextExp = await extractNextExp(resp);
      if (nextExp) {
        await schedulePreRefresh(nextExp); // ✅ 刷新成功后，继续安排下一次
      }
    } catch (e) {
      // 刷新失败 → 通知上层做登出/跳转
      console.log("refresh token error: ",e)
      onAuthInvalid?.();
    }
  }, delayMs);
}

export default api;
