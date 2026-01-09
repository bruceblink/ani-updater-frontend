import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from '../config-global';

/** 后端统一响应结构 */
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

/** 扩展 axios config */
declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

const api = axios.create({
    baseURL: CONFIG.apiUrl,
    withCredentials: true, // ⭐ 核心：cookie 自动携带
});

/* ================== 刷新控制 ================== */

let isRefreshing = false;
let subscribers: Array<() => void> = [];

/** 刷新失败时的统一处理（跳登录页） */
let onAuthInvalid: (() => void) | null = null;
export function setOnAuthInvalid(handler: (() => void) | null) {
    onAuthInvalid = handler;
}

/* ================== 响应拦截 ================== */

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError & { config?: InternalAxiosRequestConfig }) => {
        const original = error.config;
        if (!original || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // refresh 本身失败 → 强制登出
        if (original.url?.includes('/auth/token/refresh')) {
            onAuthInvalid?.();
            return Promise.reject(error);
        }

        // 防止无限重试
        if (original._retry) {
            onAuthInvalid?.();
            return Promise.reject(error);
        }

        original._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;
            try {
                await api.post('/auth/token/refresh');
                subscribers.forEach((cb) => cb());
                subscribers = [];
            } catch (e) {
                subscribers = [];
                onAuthInvalid?.();
                return Promise.reject(e);
            } finally {
                isRefreshing = false;
            }
        }

        return new Promise((resolve) => {
            subscribers.push(() => resolve(api(original)));
        });
    }
);

export default api;
