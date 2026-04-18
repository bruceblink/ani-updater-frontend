import type { NewsEvent } from 'src/hooks/useNewsAnalytics';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import useNewsEventData from 'src/hooks/useNewsAnalytics';

import { fDate, fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

const STATUS_MAP: Record<number, { label: string; color: 'default' | 'info' | 'success' | 'warning' | 'error' }> = {
    0: { label: '自动生成', color: 'default' },
    1: { label: '已确认', color: 'success' },
    2: { label: '已归档', color: 'info' },
    3: { label: '已合并', color: 'warning' },
};

export function NewsEventsView() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
    const [detailEvent, setDetailEvent] = useState<NewsEvent | null>(null);

    const query = useMemo(() => ({
        page: page + 1,
        pageSize: rowsPerPage,
        filter: filterStatus !== undefined ? { status: filterStatus } : {},
    }), [page, rowsPerPage, filterStatus]);

    const { data, loading, error } = useNewsEventData(query);

    const items = useMemo(() => data?.items ?? [], [data]);
    const totalCount = data?.totalCount ?? 0;

    const handleFilterStatus = useCallback((val: number | undefined) => {
        setFilterStatus(val);
        setPage(0);
    }, []);

    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={3}>
                <Typography variant="h4" flexGrow={1}>
                    热点事件
                </Typography>
            </Box>

            <Card>
                <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" mr={1}>状态筛选：</Typography>
                    <Chip
                        label="全部"
                        size="small"
                        variant={filterStatus === undefined ? 'filled' : 'outlined'}
                        color={filterStatus === undefined ? 'primary' : 'default'}
                        onClick={() => handleFilterStatus(undefined)}
                    />
                    {Object.entries(STATUS_MAP).map(([k, v]) => (
                        <Chip
                            key={k}
                            label={v.label}
                            size="small"
                            variant={filterStatus === Number(k) ? 'filled' : 'outlined'}
                            color={filterStatus === Number(k) ? v.color : 'default'}
                            onClick={() => handleFilterStatus(Number(k))}
                        />
                    ))}
                </Box>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && !loading && (
                    <Box sx={{ p: 2 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                {!loading && !error && (
                    <Scrollbar>
                        <TableContainer>
                            <Table sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>标题</TableCell>
                                        <TableCell>事件日期</TableCell>
                                        <TableCell align="right">新闻数量</TableCell>
                                        <TableCell align="right">热度评分</TableCell>
                                        <TableCell align="center">状态</TableCell>
                                        <TableCell align="right">操作</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((row) => {
                                        const st = STATUS_MAP[row.status] ?? STATUS_MAP[0];
                                        return (
                                            <TableRow key={row.id} hover>
                                                <TableCell sx={{ maxWidth: 320 }}>
                                                    <Typography variant="body2" noWrap>
                                                        {row.title ?? '—'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {fDate(row.eventDate)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2">
                                                        {row.newsCount}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2">
                                                        {row.score != null ? row.score.toFixed(2) : '—'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Label color={st.color}>{st.label}</Label>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        title="查看详情"
                                                        onClick={() => setDetailEvent(row)}
                                                    >
                                                        <Iconify icon="solar:eye-bold" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                                暂无数据
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                )}

                <TablePagination
                    component="div"
                    page={page}
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    labelRowsPerPage="每页行数"
                />
            </Card>

            {/* Detail Dialog */}
            <Dialog open={!!detailEvent} onClose={() => setDetailEvent(null)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    事件详情
                    <IconButton
                        onClick={() => setDetailEvent(null)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <Iconify icon="mingcute:close-line" />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {detailEvent && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {detailEvent.title ?? '暂无标题'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" whiteSpace="pre-line">
                                {detailEvent.summary ?? '暂无摘要'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Typography variant="caption">事件日期：{fDate(detailEvent.eventDate)}</Typography>
                                <Typography variant="caption">新闻数量：{detailEvent.newsCount}</Typography>
                                <Typography variant="caption">热度评分：{detailEvent.score?.toFixed(2) ?? '—'}</Typography>
                                <Typography variant="caption">创建时间：{fDateTime(detailEvent.createdAt)}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardContent>
    );
}
