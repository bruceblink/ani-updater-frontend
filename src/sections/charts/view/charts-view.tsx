import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import useNewsChartData from 'src/hooks/useNewsChartData';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsCurrentVisits } from 'src/sections/overview/analytics-current-visits';
import { AnalyticsWebsiteVisits } from 'src/sections/overview/analytics-website-visits';

// ----------------------------------------------------------------------

export function ChartsView() {
    const { eventsByDate, eventsByStatus, loading } = useNewsChartData();

    return (
        <DashboardContent>
            <Typography variant="h4" sx={{ mb: 5 }}>
                数据图表
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <AnalyticsWebsiteVisits
                        title="热点事件趋势"
                        subheader="按日期统计热点事件数量（最近 100 条）"
                        chart={{
                            categories: loading ? [] : eventsByDate.map((d) => d.date),
                            series: [
                                {
                                    name: '事件数',
                                    data: loading ? [] : eventsByDate.map((d) => d.count),
                                },
                            ],
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <AnalyticsCurrentVisits
                        title="事件状态分布"
                        subheader="0=自动 1=确认 2=归档 3=合并"
                        chart={{
                            series: loading ? [] : eventsByStatus,
                        }}
                    />
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
