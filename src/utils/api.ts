import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import axios from 'axios';
import dayjs from 'dayjs';

import { CONFIG } from '../config-global';

/** 后端返回的统一响应格式 */
export interface ApiResponse<T = unknown> {
    status: 'ok' | 'error';
    message?: string;
    data?: T;
}

export interface PageData<T> {
    items: T[]; // 当前页的数据
    totalCount: number; // 总条数
    page: number; // 当前页码（1开始）
    pageSize: number; // 每页数量
    totalPages: number; // 总页数
}

// ---- 类型增强：给 axios 的 config 增加一个开关字段 ----
declare module 'axios' {
    export interface AxiosRequestConfig {
        /** 标记该请求不参与 refresh 拦截与全局 loading 统计 */
        skipAuthRefresh?: boolean;
        _retry?: boolean;
    }
}

const api = axios.create({
    baseURL: import.meta.env.DEV ? '' : CONFIG.apiUrl,
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];
let preRefreshTimer: ReturnType<typeof setTimeout> | null = null;

let onAuthInvalid: (() => void) | null = null;
export function setOnAuthInvalid(handler: (() => void) | null) {
    onAuthInvalid = handler;
}

// 请求拦截器
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

// 响应拦截器
api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError & { config?: InternalAxiosRequestConfig }) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        // /auth/refresh 或 /api/me 失败直接登出
        if (
            error.response?.status === 401 &&
            (originalRequest.url?.includes('/auth/refresh') ||
                originalRequest.url?.includes('/api/me'))
        ) {
            onAuthInvalid?.();
            return Promise.reject(error);
        }

        // 对其他 401 请求触发刷新
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const resp = await api.post('/auth/refresh', null, { skipAuthRefresh: true });
                    const newToken = resp.data.access_token;
                    localStorage.setItem('access_token', newToken);
                    isRefreshing = false;
                    refreshSubscribers.forEach((cb) => cb());
                    refreshSubscribers = [];
                } catch (e) {
                    isRefreshing = false;
                    refreshSubscribers.forEach((cb) => cb());
                    refreshSubscribers = [];
                    onAuthInvalid?.();
                    return Promise.reject(e);
                }
            }

            return new Promise((resolve) => {
                refreshSubscribers.push(() => {
                    originalRequest.headers['Authorization'] =
                        `Bearer ${localStorage.getItem('access_token')}`;
                    resolve(api(originalRequest));
                });
            });
        }
        return Promise.reject(error);
    }
);

// 预刷新 token
export async function schedulePreRefresh(exp: number) {
    if (preRefreshTimer) clearTimeout(preRefreshTimer);

    const now = dayjs().unix();
    const delayMs = (exp - now - 60) * 1000;
    if (delayMs <= 0) return;

    preRefreshTimer = setTimeout(async () => {
        try {
            const resp = await api.post('/auth/refresh', null, { skipAuthRefresh: true });
            const nextExp = resp.data?.data?.access_token_exp;
            if (nextExp) await schedulePreRefresh(nextExp);
        } catch (e) {
            console.log('refresh token error:', e);
            onAuthInvalid?.();
        }
    }, delayMs);
}

export default api;
