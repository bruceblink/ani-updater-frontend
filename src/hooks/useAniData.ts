import {useState, useEffect, useCallback} from 'react';

import api from 'src/utils/api';

/** 后端返回的统一响应格式 */
export interface ApiResponse<T = unknown> {
  status: 'ok' | 'error'
  message?: string
  data?: T
}

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
    data: Ani[];
    loading: boolean;
    error: string | null;
    errors: Record<string, string>;
    /** 刷新网络并重新加载，返回一个 Promise */
    refresh: () => Promise<void>;
};


export default function useAniData(): AniData {
    const [data, setData] = useState<Ani[]>([]);
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
          const res = await api.get("/api/anis");
          const a = res.data?.data;
          setData(a);
        } catch (e: unknown) {
            const err = e instanceof Error ? e : new Error('未知错误');
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    // 初次挂载只读取本地
    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    // 刷新时：先网络拉取再本地加载
    const refresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    return { data, loading, error, errors, refresh };
}