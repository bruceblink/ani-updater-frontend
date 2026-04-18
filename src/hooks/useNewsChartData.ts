import type { ApiResponse, PageData } from 'src/utils/api';
import type { NewsEvent } from 'src/hooks/useNewsAnalytics';

import { useState, useEffect } from 'react';

import api from 'src/utils/api';

export interface DateCount {
    date: string;
    count: number;
}

export interface StatusCount {
    label: string;
    value: number;
}

export interface NewsChartData {
    /** 按日期分组的事件数量（用于趋势折线/柱状图） */
    eventsByDate: DateCount[];
    /** 按状态分组的事件数量（用于饼图） */
    eventsByStatus: StatusCount[];
    loading: boolean;
    error: string | null;
}

const STATUS_LABELS: Record<number, string> = {
    0: '自动生成',
    1: '已确认',
    2: '已归档',
    3: '已合并',
};

export default function useNewsChartData(): NewsChartData {
    const [data, setData] = useState<NewsChartData>({
        eventsByDate: [],
        eventsByStatus: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get<ApiResponse<PageData<NewsEvent>>>('/api/news/events', {
                    params: { page: 1, pageSize: 100 },
                });
                const events = res.data.data?.items ?? [];

                const dateMap: Record<string, number> = {};
                const statusMap: Record<number, number> = {};

                for (const event of events) {
                    const date = event.eventDate ?? '未知';
                    dateMap[date] = (dateMap[date] ?? 0) + 1;
                    statusMap[event.status] = (statusMap[event.status] ?? 0) + 1;
                }

                const eventsByDate = Object.entries(dateMap)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, count]) => ({ date, count }));

                const eventsByStatus = Object.entries(statusMap).map(([status, value]) => ({
                    label: STATUS_LABELS[Number(status)] ?? `状态${status}`,
                    value,
                }));

                setData({ eventsByDate, eventsByStatus, loading: false, error: null });
            } catch (e: unknown) {
                const err = e instanceof Error ? e : new Error('图表数据加载失败');
                setData((prev) => ({ ...prev, loading: false, error: err.message }));
            }
        };

        void fetchData();
    }, []);

    return data;
}
