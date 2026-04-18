import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import useDashboardStats from 'src/hooks/useDashboardStats';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
    const stats = useDashboardStats();

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Hi, Welcome back 👋
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <AnalyticsWidgetSummary
                        title="番剧收藏"
                        percent={0}
                        total={stats.animeTotal}
                        icon={<img alt="番剧收藏" src="/assets/icons/glass/ic-glass-bag.svg" />}
                        chart={{
                            categories: ['', '', '', '', '', '', '', ''],
                            series: [1, 1, 1, 1, 1, 1, 1, 1],
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <AnalyticsWidgetSummary
                        title="新闻条目"
                        percent={0}
                        total={stats.newsItemsTotal}
                        color="secondary"
                        icon={<img alt="新闻条目" src="/assets/icons/glass/ic-glass-users.svg" />}
                        chart={{
                            categories: ['', '', '', '', '', '', '', ''],
                            series: [1, 1, 1, 1, 1, 1, 1, 1],
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <AnalyticsWidgetSummary
                        title="热点事件"
                        percent={0}
                        total={stats.newsEventsTotal}
                        color="warning"
                        icon={<img alt="热点事件" src="/assets/icons/glass/ic-glass-buy.svg" />}
                        chart={{
                            categories: ['', '', '', '', '', '', '', ''],
                            series: [1, 1, 1, 1, 1, 1, 1, 1],
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <AnalyticsWidgetSummary
                        title="定时任务"
                        percent={0}
                        total={stats.tasksTotal}
                        color="error"
                        icon={
                            <img alt="定时任务" src="/assets/icons/glass/ic-glass-message.svg" />
                        }
                        chart={{
                            categories: ['', '', '', '', '', '', '', ''],
                            series: [1, 1, 1, 1, 1, 1, 1, 1],
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <AnalyticsNews
                        title="最新热点事件"
                        subheader={`共 ${stats.newsEventsTotal} 个事件`}
                        list={stats.recentEvents}
                    />
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
