import type { ScheduledTask } from 'src/hooks/useScheduledTasks';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type TaskTableRowProps = {
    row: ScheduledTask;
    selected: boolean;
    onSelectRow: () => void;
    onEdit: (row: ScheduledTask) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number, isEnabled: boolean) => void;
};

export function TaskTableRow({ row, selected, onSelectRow, onEdit, onDelete, onToggleStatus }: TaskTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const lastStatusColor =
        row.lastStatus === 'success' ? 'success' :
        row.lastStatus === 'running' ? 'info' :
        row.lastStatus === 'failed' ? 'error' : 'default';

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
                </TableCell>

                <TableCell component="th" scope="row">
                    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                        {row.name}
                    </Box>
                </TableCell>

                <TableCell>
                    <Box component="code" sx={{ fontSize: '0.8rem', bgcolor: 'action.hover', px: 0.75, py: 0.25, borderRadius: 0.5 }}>
                        {row.cron}
                    </Box>
                </TableCell>

                <TableCell align="center">
                    <Label color={row.isEnabled ? 'success' : 'default'}>
                        {row.isEnabled ? '启用' : '禁用'}
                    </Label>
                </TableCell>

                <TableCell align="center">{row.retryTimes}</TableCell>

                <TableCell>
                    {row.lastRun ? fDateTime(row.lastRun) : '-'}
                </TableCell>

                <TableCell>
                    {row.nextRun ? fDateTime(row.nextRun) : '-'}
                </TableCell>

                <TableCell>
                    {row.lastStatus ? (
                        <Label color={lastStatusColor as 'success' | 'info' | 'error' | 'default'}>
                            {row.lastStatus}
                        </Label>
                    ) : '-'}
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 160,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                        },
                    }}
                >
                    <MenuItem onClick={() => { handleClosePopover(); onEdit(row); }}>
                        <Iconify icon="solar:pen-bold" />
                        编辑
                    </MenuItem>

                    <MenuItem onClick={() => { handleClosePopover(); onToggleStatus(row.id, !row.isEnabled); }}>
                        <Iconify icon={row.isEnabled ? 'solar:pause-bold' : 'solar:play-bold'} />
                        {row.isEnabled ? '禁用' : '启用'}
                    </MenuItem>

                    <MenuItem onClick={() => { handleClosePopover(); onDelete(row.id); }} sx={{ color: 'error.main' }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        删除
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}
