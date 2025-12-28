import type { PageData, ApiResponse } from 'src/utils/api';

import { useState, useEffect, useCallback } from 'react';

import api from 'src/utils/api';

/** News 结构体对应的 TS 接口 */
export interface NewsEvent {
    id: number;
    event_date: string;
    title: string;
    summary: string;
    news_count: string;
    score: string;
    status: string;
}

// Hook 对外暴露的状态
export type NewsEventData = {
    data: PageData<NewsEvent>;
    loading: boolean;
    error: string | null;
    errors: Record<string, string>;
    /** 刷新网络并重新加载，返回一个 Promise */
    refresh: () => Promise<void>;
};

export interface NewsQuery {
    page?: number; // 可选
    pageSize?: number; // 可选
    filter?: NewsFilter; // 可选
}

export interface NewsFilter {
    title?: string;
    event_date?: string;
}

export default function useNewsEventData(params: NewsQuery | null): NewsEventData {
    const [data, setData] = useState<PageData<NewsEvent>>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 重置 loading 和 error 状态
    const resetState = useCallback(() => {
        setLoading(true);
        setError(null);
    }, []);

    // 从网络拉取
    const fetchData = useCallback(async () => {
        resetState();
        try {
            const res = await api.get<ApiResponse<PageData<NewsEvent>>>('/api/analysis/events', {
                baseURL: "https://news-analytics-gw35.onrender.com",
                params,
            });
            const a = res.data.data;
            setData(a);
        } catch (e: unknown) {
            const err = e instanceof Error ? e : new Error('未知错误');
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [params, resetState]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    const refresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    return { data, loading, error, refresh } as NewsEventData;
}
