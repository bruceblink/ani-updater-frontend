import type { NewsItemFilter } from 'src/hooks/useNewsItems';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import useNewsItems from 'src/hooks/useNewsItems';

import { fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';

export function NewsItemsView() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterSource, setFilterSource] = useState('');
    const [filterExtracted, setFilterExtracted] = useState<boolean | undefined>(undefined);

    const filter = useMemo<NewsItemFilter>(() => ({
        ...(filterSource ? { source: filterSource } : {}),
        ...(filterExtracted !== undefined ? { extracted: filterExtracted } : {}),
    }), [filterSource, filterExtracted]);

    const query = useMemo(() => ({ page: page + 1, pageSize: rowsPerPage, filter }), [page, rowsPerPage, filter]);

    const { data, loading, error } = useNewsItems(query);

    const items = useMemo(() => data?.items ?? [], [data]);
    const totalCount = data?.totalCount ?? 0;

    const handleFilterExtracted = useCallback((val: boolean | undefined) => {
        setFilterExtracted(val);
        setPage(0);
    }, []);

    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={3}>
                <Typography variant="h4" flexGrow={1}>
                    新闻条目
                </Typography>
            </Box>

            <Card>
                <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Box
                        component="input"
                        placeholder="搜索来源..."
                        value={filterSource}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFilterSource(e.target.value);
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
                            width: 220,
                        }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            label="全部"
                            size="small"
                            variant={filterExtracted === undefined ? 'filled' : 'outlined'}
                            color={filterExtracted === undefined ? 'primary' : 'default'}
                            onClick={() => handleFilterExtracted(undefined)}
                        />
                        <Chip
                            label="已提取"
                            size="small"
                            variant={filterExtracted === true ? 'filled' : 'outlined'}
                            color={filterExtracted === true ? 'success' : 'default'}
                            onClick={() => handleFilterExtracted(true)}
                        />
                        <Chip
                            label="未提取"
                            size="small"
                            variant={filterExtracted === false ? 'filled' : 'outlined'}
                            color={filterExtracted === false ? 'warning' : 'default'}
                            onClick={() => handleFilterExtracted(false)}
                        />
                    </Box>
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
                                        <TableCell>来源</TableCell>
                                        <TableCell>发布时间</TableCell>
                                        <TableCell align="center">提取状态</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell sx={{ maxWidth: 400 }}>
                                                <Link href={row.url} target="_blank" rel="noopener" underline="hover" variant="body2">
                                                    {row.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {row.source ?? '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {fDateTime(row.publishedAt)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Label color={row.extracted ? 'success' : 'warning'}>
                                                    {row.extracted ? '已提取' : '未提取'}
                                                </Label>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
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
        </DashboardContent>
    );
}
