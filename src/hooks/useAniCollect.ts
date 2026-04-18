import type { PageData, ApiResponse } from 'src/utils/api';

import { useState, useEffect, useCallback } from 'react';

import api from 'src/utils/api';

/** AniCollect 结构体对应的 TS 接口（对应 AniCollectDTO） */
export interface AniCollect {
    id: number;
    aniItemId: number;
    aniTitle: string;
    collectTime: string;
    isWatched: boolean;
}

export type AniCollectData = {
    data: PageData<AniCollect>;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};

export interface AniCollectQuery {
    page?: number;
    pageSize?: number;
    filter?: AniCollectFilter;
}

export interface AniCollectFilter {
    aniTitle?: string;
    isWatched?: boolean;
}

export interface AddCollectDto {
    aniItemId: number;
    aniTitle: string;
}

/** 番剧收藏 CRUD API */
export const aniCollectApi = {
    list: (params?: AniCollectQuery) =>
        api.get<ApiResponse<PageData<AniCollect>>>('/api/anis/collect', { params }),

    add: (dto: AddCollectDto) =>
        api.post<ApiResponse<AniCollect>>('/api/anis/collect', dto),

    remove: (id: number) =>
        api.delete<ApiResponse<null>>(`/api/anis/collect/${id}`),

    setWatched: (id: number, isWatched: boolean) =>
        api.patch<ApiResponse<null>>(`/api/anis/collect/${id}/watched`, { isWatched }),
};

export default function useAniCollect(params: AniCollectQuery | null): AniCollectData {
    const [data, setData] = useState<PageData<AniCollect>>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetState = useCallback(() => {
        setLoading(true);
        setError(null);
    }, []);

    const fetchData = useCallback(async () => {
        resetState();
        try {
            const res = await api.get<ApiResponse<PageData<AniCollect>>>('/api/anis/collect', {
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

    return { data, loading, error, refresh } as AniCollectData;
}
