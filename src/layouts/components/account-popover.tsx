import type { IconButtonProps } from '@mui/material/IconButton';

import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter, usePathname } from 'src/routes/hooks';

import api from 'src/utils/api';

import { _myAccount } from 'src/_mock';
// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
    data?: {
        label: string;
        href: string;
        icon?: React.ReactNode;
        info?: React.ReactNode;
    }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
    const router = useRouter();

    const pathname = usePathname();

    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleClickItem = useCallback(
        (path: string) => {
            handleClosePopover();
            router.push(path);
        },
        [handleClosePopover, router]
    );

    // 🔹 新增 logout 事件
    const handleLogout = useCallback(async () => {
        if (loggingOut) return; // 防止重复点击
        setLoggingOut(true);
        handleClosePopover();

        try {
            // 🔹 调用后端 logout API，后端会清除 HTTP-only Cookie
            await api.post('/logout');
        } catch (err) {
            console.error('Logout failed', err);
            // 可选：toast 提示用户
        }finally {
            // 清理前端本地状态（如果有）
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // 🔹 跳转到登录页
            // 强制跳转刷新页面
            window.location.href = '/sign-in';
        }
    }, [handleClosePopover, loggingOut]);

    return (
        <>
            <IconButton
                onClick={handleOpenPopover}
                sx={{
                    p: '2px',
                    width: 40,
                    height: 40,
                    background: (theme) =>
                        `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
                    ...sx,
                }}
                {...other}
            >
                <Avatar
                    src={_myAccount.photoURL}
                    alt={_myAccount.displayName}
                    sx={{ width: 1, height: 1 }}
                >
                    {_myAccount.displayName.charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: { width: 200 },
                    },
                }}
            >
                <Box sx={{ p: 2, pb: 1.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        {_myAccount?.displayName}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {_myAccount?.email}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuList
                    disablePadding
                    sx={{
                        p: 1,
                        gap: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            color: 'text.secondary',
                            '&:hover': { color: 'text.primary' },
                            [`&.${menuItemClasses.selected}`]: {
                                color: 'text.primary',
                                bgcolor: 'action.selected',
                                fontWeight: 'fontWeightSemiBold',
                            },
                        },
                    }}
                >
                    {data.map((option) => (
                        <MenuItem
                            key={option.label}
                            selected={option.href === pathname}
                            onClick={() => handleClickItem(option.href)}
                        >
                            {option.icon}
                            {option.label}
                        </MenuItem>
                    ))}
                </MenuList>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ p: 1 }}>
                    <Button
                        fullWidth
                        color="error"
                        size="medium"
                        variant="text"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                </Box>
            </Popover>
        </>
    );
}
