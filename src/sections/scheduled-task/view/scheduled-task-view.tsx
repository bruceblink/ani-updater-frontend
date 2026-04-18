import type { ScheduledTask, CreateScheduledTaskDto, UpdateScheduledTaskDto } from 'src/hooks/useScheduledTasks';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Snackbar from '@mui/material/Snackbar';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';

import useScheduledTasksData, { scheduledTaskApi } from 'src/hooks/useScheduledTasks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TaskTableRow } from '../task-table-row';
import { TaskTableHead } from '../task-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { TaskTableToolbar } from '../task-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

type TaskFormState = {
    name: string;
    cron: string;
    params: string;
    isEnabled: boolean;
    retryTimes: number;
};

const defaultFormState: TaskFormState = {
    name: '',
    cron: '',
    params: '{}',
    isEnabled: true,
    retryTimes: 3,
};

export function ScheduledTaskView() {
    const table = useTable();
    const query = useMemo(() => ({ page: table.page + 1, pageSize: table.rowsPerPage }), [table.page, table.rowsPerPage]);
    const { data, loading, error, refresh } = useScheduledTasksData(query);

    const items = useMemo(() => data?.items ?? [], [data?.items]);
    const totalCount = data?.totalCount ?? 0;
    const [filterName, setFilterName] = useState('');

    // ---- Dialog state ----
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<ScheduledTask | null>(null);
    const [formState, setFormState] = useState<TaskFormState>(defaultFormState);
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // ---- Snackbar state ----
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    // ---- Dialog handlers ----
    const handleOpenCreate = useCallback(() => {
        setEditingTask(null);
        setFormState(defaultFormState);
        setFormError(null);
        setDialogOpen(true);
    }, []);

    const handleOpenEdit = useCallback((task: ScheduledTask) => {
        setEditingTask(task);
        setFormState({
            name: task.name,
            cron: task.cron,
            params: JSON.stringify(task.params, null, 2),
            isEnabled: task.isEnabled,
            retryTimes: task.retryTimes,
        });
        setFormError(null);
        setDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const handleSubmit = useCallback(async () => {
        setFormError(null);

        let parsedParams: Record<string, unknown>;
        try {
            parsedParams = JSON.parse(formState.params);
        } catch {
            setFormError('params 不是合法的 JSON 格式');
            return;
        }

        setSubmitting(true);
        try {
            if (editingTask) {
                const dto: UpdateScheduledTaskDto = {
                    name: formState.name,
                    cron: formState.cron,
                    params: parsedParams,
                    retryTimes: formState.retryTimes,
                };
                await scheduledTaskApi.update(editingTask.id, dto);
                showSnackbar('任务更新成功', 'success');
            } else {
                const dto: CreateScheduledTaskDto = {
                    name: formState.name,
                    cron: formState.cron,
                    params: parsedParams,
                    isEnabled: formState.isEnabled,
                    retryTimes: formState.retryTimes,
                };
                await scheduledTaskApi.create(dto);
                showSnackbar('任务创建成功', 'success');
            }
            setDialogOpen(false);
            await refresh();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : '操作失败';
            setFormError(msg);
            showSnackbar(msg, 'error');
        } finally {
            setSubmitting(false);
        }
    }, [editingTask, formState, refresh, showSnackbar]);

    // ---- Action handlers ----
    const handleDelete = useCallback(async (id: number) => {
        if (!window.confirm('确定要删除该任务吗？')) return;
        try {
            await scheduledTaskApi.delete(id);
            showSnackbar('任务删除成功', 'success');
            await refresh();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : '删除失败';
            showSnackbar(msg, 'error');
        }
    }, [refresh, showSnackbar]);

    const handleToggleStatus = useCallback(async (id: number, isEnabled: boolean) => {
        try {
            await scheduledTaskApi.toggleStatus(id, isEnabled);
            showSnackbar(isEnabled ? '任务已启用' : '任务已禁用', 'success');
            await refresh();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : '状态切换失败';
            showSnackbar(msg, 'error');
        }
    }, [refresh, showSnackbar]);

    if (loading)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    if (error)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                查询出错了: {error}
            </Box>
        );
    if (!data)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                没有数据
            </Box>
        );

    const dataFiltered: ScheduledTask[] = applyFilter({
        inputData: items,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <DashboardContent>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    定时任务
                </Typography>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleOpenCreate}
                >
                    新建任务
                </Button>
            </Box>

            <Card>
                <TaskTableToolbar
                    numSelected={table.selected.length}
                    filterName={filterName}
                    onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFilterName(event.target.value);
                        table.onResetPage();
                    }}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 900 }}>
                            <TaskTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={items.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        items.map((task) => String(task.id))
                                    )
                                }
                                headLabel={[
                                    { id: 'name', label: '任务名称' },
                                    { id: 'cron', label: 'Cron 表达式' },
                                    { id: 'isEnabled', label: '状态', align: 'center' },
                                    { id: 'retryTimes', label: '重试次数', align: 'center' },
                                    { id: 'lastRun', label: '上次运行' },
                                    { id: 'nextRun', label: '下次运行' },
                                    { id: 'lastStatus', label: '运行结果' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered.map((row) => (
                                    <TaskTableRow
                                        key={row.id}
                                        row={row}
                                        selected={table.selected.includes(String(row.id))}
                                        onSelectRow={() => table.onSelectRow(String(row.id))}
                                        onEdit={handleOpenEdit}
                                        onDelete={handleDelete}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                ))}

                                <TableEmptyRows
                                    height={68}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, items.length)}
                                />

                                {notFound && <TableNoData searchQuery={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    component="div"
                    page={table.page}
                    count={totalCount}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>

            {/* Create / Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingTask ? '编辑任务' : '新建任务'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    {formError && <Alert severity="error">{formError}</Alert>}
                    <TextField
                        label="任务名称"
                        value={formState.name}
                        onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Cron 表达式"
                        value={formState.cron}
                        onChange={(e) => setFormState((s) => ({ ...s, cron: e.target.value }))}
                        placeholder="例：0 */6 * * *"
                        required
                        fullWidth
                    />
                    <TextField
                        label="任务参数 (JSON)"
                        value={formState.params}
                        onChange={(e) => setFormState((s) => ({ ...s, params: e.target.value }))}
                        multiline
                        minRows={3}
                        fullWidth
                        inputProps={{ style: { fontFamily: 'monospace', fontSize: '0.85rem' } }}
                    />
                    <TextField
                        label="最大重试次数"
                        type="number"
                        value={formState.retryTimes}
                        onChange={(e) => setFormState((s) => ({ ...s, retryTimes: parseInt(e.target.value, 10) || 0 }))}
                        inputProps={{ min: 0 }}
                        fullWidth
                    />
                    {!editingTask && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formState.isEnabled}
                                    onChange={(e) => setFormState((s) => ({ ...s, isEnabled: e.target.checked }))}
                                />
                            }
                            label="立即启用"
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={submitting}>取消</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                        {submitting ? '保存中…' : '保存'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </DashboardContent>
    );
}

// ----------------------------------------------------------------------

export function useTable() {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState<string[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const onSort = useCallback(
        (id: string) => {
            const isAsc = orderBy === id && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        },
        [order, orderBy]
    );

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        if (checked) {
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const onSelectRow = useCallback(
        (inputValue: string) => {
            const newSelected = selected.includes(inputValue)
                ? selected.filter((value) => value !== inputValue)
                : [...selected, inputValue];

            setSelected(newSelected);
        },
        [selected]
    );

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((_: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            onResetPage();
        },
        [onResetPage]
    );

    return {
        page,
        order,
        onSort,
        orderBy,
        selected,
        rowsPerPage,
        onSelectRow,
        onResetPage,
        onChangePage,
        onSelectAllRows,
        onChangeRowsPerPage,
    };
}