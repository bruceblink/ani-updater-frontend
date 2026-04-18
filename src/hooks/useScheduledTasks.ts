import type { PageData, ApiResponse } from 'src/utils/api';

import { useState, useEffect, useCallback } from 'react';

import api from 'src/utils/api';

/** ScheduledTask 结构体对应的 TS 接口（对应 ScheduledTasksDTO） */
export interface ScheduledTask {
    id: number;
    name: string;
    cron: string;
    params: Record<string, unknown>;
    isEnabled: boolean;
    retryTimes: number;
    lastRun: string | null;
    nextRun: string | null;
    lastStatus: string;
}

export interface CreateScheduledTaskDto {
    name: string;
    cron: string;
    params: Record<string, unknown>;
    isEnabled?: boolean;
    retryTimes?: number;
}

export interface UpdateScheduledTaskDto {
    name?: string;
    cron?: string;
    params?: Record<string, unknown>;
    retryTimes?: number;
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
    isEnabled?: boolean;
}

/** 定时任务 CRUD API */
export const scheduledTaskApi = {
    create: (dto: CreateScheduledTaskDto) =>
        api.post<ApiResponse<ScheduledTask>>('/api/scheduledTasks', dto),

    update: (id: number, dto: UpdateScheduledTaskDto) =>
        api.put<ApiResponse<ScheduledTask>>(`/api/scheduledTasks/${id}`, dto),

    toggleStatus: (id: number, isEnabled: boolean) =>
        api.patch<ApiResponse<ScheduledTask>>(`/api/scheduledTasks/${id}/status`, { isEnabled }),

    delete: (id: number) =>
        api.delete<ApiResponse<null>>(`/api/scheduledTasks/${id}`),

    reloadScheduler: () =>
        api.post<ApiResponse<unknown>>('/admin/task/reload'),
};

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
