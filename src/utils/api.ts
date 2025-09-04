import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import axios from "axios";
import dayjs from "dayjs";

import { CONFIG } from "src/config-global";

// ---- 类型增强：给 axios 的 config 增加一个开关字段 ----
declare module "axios" {
  export interface AxiosRequestConfig {
    /** 标记该请求不参与 refresh 拦截与全局 loading 统计 */
    skipAuthRefresh?: boolean;
    _retry?: boolean;
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
const setGlobalLoading = (show: boolean) => console.log("global loading:", show);
const showGlobalError = (msg: string) => console.error(msg);

// 请求拦截器
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.skipAuthRefresh) {
    loadingCount++;
    setGlobalLoading(true);
  }

  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (res) => {
    if (!res.config.skipAuthRefresh) {
      loadingCount--;
      if (loadingCount <= 0) setGlobalLoading(false);
    }
    return res;
  },
  async (error: AxiosError & { config?: InternalAxiosRequestConfig }) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (!originalRequest?.skipAuthRefresh) {
      loadingCount--;
      if (loadingCount <= 0) setGlobalLoading(false);
    }

    if (originalRequest?.url?.includes("/auth/refresh")) {
      onAuthInvalid?.();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const resp = await api.post("/auth/refresh", null, { skipAuthRefresh: true });
          const newToken = resp.data.access_token;
          localStorage.setItem("access_token", newToken);
          isRefreshing = false;
          onRefreshed();

          const nextExp = await extractNextExp(resp);
          if (nextExp) await schedulePreRefresh(nextExp);
        } catch (e) {
          isRefreshing = false;
          onRefreshed();
          onAuthInvalid?.();
          return Promise.reject(e);
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push(() => {
          if (originalRequest.headers) {
            originalRequest.headers.set("Authorization", `Bearer ${localStorage.getItem("access_token")}`);
          }
          resolve(api(originalRequest));
        });
      });
    }

    showGlobalError(error.message || "请求失败");
    return Promise.reject(error);
  }
);

function onRefreshed() {
  refreshSubscribers.forEach(cb => cb());
  refreshSubscribers = [];
}

async function extractNextExp(resp?: any): Promise<number | undefined> {
  let exp: number | undefined =
    resp?.data?.exp ??
    (resp?.headers?.["x-access-exp"] ? Number(resp.headers["x-access-exp"]) : undefined);

  if (!exp) {
    try {
      const me = await api.get("/api/me", { skipAuthRefresh: true });
      exp = me.data?.exp;
    } catch {
      console.warn("no exp param")
    }
  }
  return exp;
}

export async function schedulePreRefresh(exp: number) {
  if (preRefreshTimer) clearTimeout(preRefreshTimer);

  const now = dayjs().unix();
  const delayMs = (exp - now - 60) * 1000;
  if (delayMs <= 0) return;

  preRefreshTimer = setTimeout(async () => {
    try {
      const resp = await api.post("/auth/refresh", null, { skipAuthRefresh: true });
      const nextExp = await extractNextExp(resp);
      if (nextExp) await schedulePreRefresh(nextExp);
    } catch (e) {
      console.log("refresh token error:", e);
      onAuthInvalid?.();
    }
  }, delayMs);
}

export default api;
