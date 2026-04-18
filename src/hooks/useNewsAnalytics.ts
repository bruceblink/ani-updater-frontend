import type { PageData, ApiResponse } from 'src/utils/api';

import { useState, useEffect, useCallback } from 'react';

import api from 'src/utils/api';

/** NewsEvent 结构体对应的 TS 接口（对应 NewsEventDTO） */
export interface NewsEvent {
    id: number;
    eventDate: string;
    clusterId: number;
    title: string | null;
    summary: string | null;
    newsCount: number;
    score: number | null;
    /** 0=自动生成 / 1=已确认 / 2=已归档 / 3=已合并 */
    status: number;
    parentEventId: number | null;
    createdAt: string;
}

// Hook 对外暴露的状态
export type NewsEventData = {
    data: PageData<NewsEvent>;
    loading: boolean;
    error: string | null;
    /** 刷新网络并重新加载，返回一个 Promise */
    refresh: () => Promise<void>;
};

export interface NewsEventQuery {
    page?: number;
    pageSize?: number;
    filter?: NewsEventFilter;
}

export interface NewsEventFilter {
    eventDate?: string;
    /** 0=自动生成 / 1=已确认 / 2=已归档 / 3=已合并 */
    status?: number;
}

export default function useNewsEventData(params: NewsEventQuery | null): NewsEventData {
    const [data, setData] = useState<PageData<NewsEvent>>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetState = useCallback(() => {
        setLoading(true);
        setError(null);
    }, []);

    const fetchData = useCallback(async () => {
        resetState();
        try {
            const res = await api.get<ApiResponse<PageData<NewsEvent>>>('/api/news/events', {
                params,
            });
            setData(res.data.data);
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
