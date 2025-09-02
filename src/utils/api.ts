import axios from "axios";
import dayjs from "dayjs";

import { CONFIG } from "src/config-global";

// 创建 Axios 实例
const api = axios.create({
  baseURL: CONFIG.apiUrl,
  withCredentials: true, // 发送 HttpOnly cookie
});

let loadingCount = 0;

// 可选：全局 loading 状态
export const setGlobalLoading = (loading: boolean) => {
  console.log("全局 loading:", loading);
};

// 可选：全局错误处理
export const showGlobalError = (msg: string) => {
  console.error("全局错误:", msg);
};

// 请求拦截器
api.interceptors.request.use(config => {
  loadingCount++;
  setGlobalLoading(true);
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  res => {
    loadingCount--;
    if (loadingCount <= 0) setGlobalLoading(false);
    return res;
  },
  error => {
    loadingCount--;
    if (loadingCount <= 0) setGlobalLoading(false);

    showGlobalError(error.message || "请求失败");
    return Promise.reject(error);
  }
);

// 预刷新 token
export function schedulePreRefresh(exp: number) {
  const now = dayjs().unix();
  const delay = (exp - now - 60) * 1000; // 提前 60 秒刷新
  if (delay > 0) {
    setTimeout(() => {
      api.post("/auth/refresh").catch(() => {
        showGlobalError("登录状态过期，请重新登录");
        window.location.href = "/sign-in";
      });
    }, delay);
  }
}

export default api;
