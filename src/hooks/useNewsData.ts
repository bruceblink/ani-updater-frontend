import type { PageData, ApiResponse } from 'src/utils/api';

import { useState, useEffect, useCallback } from 'react';

import api from 'src/utils/api';

/** News 结构体对应的 TS 接口 */
export interface News {
    id: number;
    newsFrom: string;
    newsDate: string;
    data: Record<string, NewsItem[]>;
    createdAt: string;
    updatedAt: string;
}

export interface NewsItem {
    id: number;
    url: string;
    title: string;
}

// Hook 对外暴露的状态
export type NewsData = {
    data: PageData<News>;
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
    newsFrom?: string;
    newsDate?: string;
}

export default function useNewsData(params: NewsQuery | null): NewsData {
    const [data, setData] = useState<PageData<News>>();
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
            const res = await api.get<ApiResponse<PageData<News>>>('/api/news', {
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

    return { data, loading, error, refresh } as NewsData;
}
