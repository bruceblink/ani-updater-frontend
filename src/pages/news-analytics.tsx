import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CircularProgress } from '@mui/material';

import useNewsEventData from 'src/hooks/useNewsAnalytics';

import { CONFIG } from 'src/config-global';

import { AnalyticsNews } from 'src/sections/overview/analytics-news';

// ----------------------------------------------------------------------

export default function Page() {

    const [page] = useState(1); // 当前页码，默认 1
    const query = useMemo(() => ({ page, pageSize: 10 }), [page]);
    const { data, loading, error } = useNewsEventData(query); // 传给 hook
    const items = useMemo(() => data?.items ?? [], [data?.items]);

    if (loading)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    if (error)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                查询出错了: {error}
            </Box>
        );
    if (!data)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                没有数据
            </Box>
        );

    return (
        <>
            <title>{`News-Analytics - ${CONFIG.appName}`}</title>

            <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                <AnalyticsNews title="News Analytics" list={items} />
            </Grid>
        </>
    );
}
