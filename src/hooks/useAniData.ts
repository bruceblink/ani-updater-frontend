import type { PageData, ApiResponse } from 'src/utils/api';

import {useState, useEffect, useCallback} from 'react';

import api from 'src/utils/api';

/** Ani 结构体对应的 TS 接口 */
export interface Ani {
  id: number;
  title: string;
  update_count: string;
  detail_url: string;
  image_url: string;
  update_info: string;
  update_time: number;
  update_time_str: string;
  platform: string;
}

// Hook 对外暴露的状态
export type AniData = {
    data: PageData<Ani>;
    loading: boolean;
    error: string | null;
    errors: Record<string, string>;
    /** 刷新网络并重新加载，返回一个 Promise */
    refresh: () => Promise<void>;
};

export interface AniQuery {
  page?: number;       // 可选
  page_size?: number;  // 可选
  filter?: AniFilter;     // 可选
}

export interface AniFilter {
  title?: string;
  platform?: string;
}

export default function useAniData(params: AniQuery | null): AniData {
    const [data, setData] = useState<PageData<Ani>>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 重置 loading 和 error 状态
    const resetState = useCallback(() => {
        setLoading(true);
        setError(null);
        setErrors({});
    }, []);

    // 从网络拉取并写库
    const fetchData = useCallback(async () => {
        resetState();
        try {
          const res = await api.get<ApiResponse<PageData<Ani>>>("/api/anis",{
            params
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

    return { data, loading, error, errors, refresh } as AniData;
}