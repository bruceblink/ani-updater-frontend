import type { PageData, ApiResponse } from 'src/utils/api';

import { useState, useEffect, useCallback } from 'react';

import api from 'src/utils/api';

/** ScheduledTask 结构体对应的 TS 接口 */
export interface ScheduledTask {
    name: string;
    cron: string;
    params: JSON;
    is_enabled: boolean;
    retry_times: number;
    last_run: string;
    next_run: string;
    last_status: string;
}

// Hook 对外暴露的状态
export type ScheduledTaskData = {
    data: PageData<ScheduledTask>;
    loading: boolean;
    error: string | null;
    errors: Record<string, string>;
    /** 刷新网络并重新加载，返回一个 Promise */
    refresh: () => Promise<void>;
};

export interface ScheduledTaskQuery {
    page?: number; // 可选
    pageSize?: number; // 可选
    filter?: ScheduledTaskFilter; // 可选
}

export interface ScheduledTaskFilter {
    name?: string;
    arg?: string;
    cmd?: string;
}

export default function useScheduledTasksData(params: ScheduledTaskQuery | null): ScheduledTaskData {
    const [data, setData] = useState<PageData<ScheduledTask>>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 重置 loading 和 error 状态
    const resetState = useCallback(() => {
        setLoading(true);
        setError(null);
        setErrors({});
    }, []);

    // 从网络拉取
    const fetchData = useCallback(async () => {
        resetState();
        try {
            const res = await api.get<ApiResponse<PageData<ScheduledTask>>>('/api/scheduledTasks', {
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

    return { data, loading, error, errors, refresh } as ScheduledTaskData;
}
