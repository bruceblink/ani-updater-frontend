import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import useNewsData from 'src/hooks/useNewsData';

import { DashboardContent } from 'src/layouts/dashboard';

import { NewsCard } from '../news-card';


export function NewsView() {

    const [page, setPage] = useState(1); // 当前页码，默认 1
    const query = useMemo(() => ({ page, pageSize: 18 }), [page]);
    const { data, loading, error } = useNewsData(query); // 传给 hook
    // 获取news items
    const items = useMemo(() => data?.items ?? [], [data?.items]);

    const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value); // 更新页码
    };

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
        <DashboardContent>

            <Typography variant="h4" sx={{ mb: 5 }}>
                News
            </Typography>

            <Grid container spacing={3}>
                {items.map((news) => (
                    <Grid key={news.id} size={{ xs: 12, sm: 8, md: 6, lg: 4 }}>
                        <NewsCard
                            title={news.newsFrom}
                            list={news.data.items?.slice(0, 10) ?? []}
                        />
                    </Grid>
                ))}
            </Grid>
            <Pagination
                count={data.totalPages}
                page={page}
                onChange={handleChange}
                color="primary"
                sx={{ mt: 8, mx: 'auto' }}
            />
        </DashboardContent>
    );
}
