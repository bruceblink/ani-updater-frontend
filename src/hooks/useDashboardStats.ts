import type { ApiResponse, PageData } from 'src/utils/api';
import type { NewsEvent } from 'src/hooks/useNewsAnalytics';

import { useState, useEffect } from 'react';

import api from 'src/utils/api';

import { useAuth } from 'src/context/AuthContext';

export interface DashboardStats {
    animeTotal: number;
    newsItemsTotal: number;
    newsEventsTotal: number;
    tasksTotal: number;
    recentEvents: NewsEvent[];
    loading: boolean;
    error: string | null;
}

const EMPTY: DashboardStats = {
    animeTotal: 0,
    newsItemsTotal: 0,
    newsEventsTotal: 0,
    tasksTotal: 0,
    recentEvents: [],
    loading: true,
    error: null,
};

export default function useDashboardStats(): DashboardStats {
    const { status } = useAuth();
    const [stats, setStats] = useState<DashboardStats>(EMPTY);

    useEffect(() => {
        if (status !== 'authenticated') return;

        const fetchAll = async () => {
            setStats({ ...EMPTY, loading: true });
            try {
                const [animeRes, newsItemsRes, eventsRes, tasksRes] = await Promise.all([
                    api.get<ApiResponse<PageData<unknown>>>('/api/anis/collect', {
                        params: { page: 1, pageSize: 1 },
                    }),
                    api.get<ApiResponse<PageData<unknown>>>('/api/news/items', {
                        params: { page: 1, pageSize: 1 },
                    }),
                    api.get<ApiResponse<PageData<NewsEvent>>>('/api/news/events', {
                        params: { page: 1, pageSize: 8 },
                    }),
                    api.get<ApiResponse<PageData<unknown>>>('/api/scheduledTasks', {
                        params: { page: 1, pageSize: 1 },
                    }),
                ]);

                setStats({
                    animeTotal: animeRes.data.data?.totalCount ?? 0,
                    newsItemsTotal: newsItemsRes.data.data?.totalCount ?? 0,
                    newsEventsTotal: eventsRes.data.data?.totalCount ?? 0,
                    tasksTotal: tasksRes.data.data?.totalCount ?? 0,
                    recentEvents: eventsRes.data.data?.items ?? [],
                    loading: false,
                    error: null,
                });
            } catch (e: unknown) {
                const err = e instanceof Error ? e : new Error('数据加载失败');
                setStats((prev) => ({ ...prev, loading: false, error: err.message }));
            }
        };

        void fetchAll();
    }, [status]);

    return stats;
}
