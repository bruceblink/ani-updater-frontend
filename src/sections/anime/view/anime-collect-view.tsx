import type { AniCollect } from 'src/hooks/useAniCollect';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import useAniCollect, { aniCollectApi } from 'src/hooks/useAniCollect';

import { fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export function AnimeCollectView() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterTitle, setFilterTitle] = useState('');
    const [filterWatched, setFilterWatched] = useState<boolean | undefined>(undefined);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const query = useMemo(() => ({
        page: page + 1,
        pageSize: rowsPerPage,
        filter: {
            ...(filterTitle ? { aniTitle: filterTitle } : {}),
            ...(filterWatched !== undefined ? { isWatched: filterWatched } : {}),
        },
    }), [page, rowsPerPage, filterTitle, filterWatched]);

    const { data, loading, error, refresh } = useAniCollect(query);

    const items: AniCollect[] = useMemo(() => data?.items ?? [], [data]);
    const totalCount = data?.totalCount ?? 0;

    const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleDelete = useCallback(async (id: number, title: string) => {
        if (!window.confirm(`确定取消收藏「${title}」？`)) return;
        try {
            await aniCollectApi.remove(id);
            showSnackbar('已取消收藏', 'success');
            await refresh();
        } catch {
            showSnackbar('取消收藏失败', 'error');
        }
    }, [refresh, showSnackbar]);

    const handleToggleWatched = useCallback(async (id: number, current: boolean) => {
        try {
            await aniCollectApi.setWatched(id, !current);
            showSnackbar(current ? '已标记为未观看' : '已标记为已观看', 'success');
            await refresh();
        } catch {
            showSnackbar('更新观看状态失败', 'error');
        }
    }, [refresh, showSnackbar]);

    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={3}>
                <Typography variant="h4" flexGrow={1}>
                    番剧收藏
                </Typography>
            </Box>

            <Card>
                <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box
                        component="input"
                        placeholder="搜索番剧名..."
                        value={filterTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFilterTitle(e.target.value);
                            setPage(0);
                        }}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            px: 1.5,
                            py: 0.8,
                            fontSize: 14,
                            outline: 'none',
                            flex: 1,
                            maxWidth: 300,
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={filterWatched === true}
                                onChange={(e) => {
                                    setFilterWatched(e.target.checked ? true : undefined);
                                    setPage(0);
                                }}
                            />
                        }
                        label="只看已观看"
                    />
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
                            <Table sx={{ minWidth: 700 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>番剧名称</TableCell>
                                        <TableCell>收藏时间</TableCell>
                                        <TableCell align="center">观看状态</TableCell>
                                        <TableCell align="right">操作</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {row.aniTitle}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {fDateTime(row.collectTime)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Label
                                                    color={row.isWatched ? 'success' : 'default'}
                                                    onClick={() => handleToggleWatched(row.id, row.isWatched)}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    {row.isWatched ? '已观看' : '未观看'}
                                                </Label>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    title="取消收藏"
                                                    onClick={() => handleDelete(row.id, row.aniTitle)}
                                                >
                                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!loading && items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                                暂无收藏番剧
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
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    labelRowsPerPage="每页行数"
                />
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </DashboardContent>
    );
}
