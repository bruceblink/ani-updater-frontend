import type { PageData, ApiResponse } from 'src/utils/api';

import { useState, useEffect, useCallback } from 'react';

import api from 'src/utils/api';

/** 新闻条目（对应 NewsItemResponseDTO） */
export interface NewsItem {
    id: number;
    itemId: string;
    title: string;
    url: string;
    source: string | null;
    publishedAt: string;
    clusterId: number | null;
    extracted: boolean;
    createdAt: string | null;
}

export type NewsItemData = {
    data: PageData<NewsItem>;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};

export interface NewsItemQuery {
    page?: number;
    pageSize?: number;
    filter?: NewsItemFilter;
}

export interface NewsItemFilter {
    source?: string;
    publishedAt?: string;
    clusterId?: number;
    extracted?: boolean;
}

export default function useNewsItems(params: NewsItemQuery | null): NewsItemData {
    const [data, setData] = useState<PageData<NewsItem>>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetState = useCallback(() => {
        setLoading(true);
        setError(null);
    }, []);

    const fetchData = useCallback(async () => {
        resetState();
        try {
            const res = await api.get<ApiResponse<PageData<NewsItem>>>('/api/news/items', {
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

    return { data, loading, error, refresh } as NewsItemData;
}
