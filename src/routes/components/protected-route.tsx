import type { UserRole } from 'src/context/AuthContext'; // 导入 UserRole 类型

import { useEffect, useCallback, type ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { useAuth } from 'src/context/AuthContext';

interface Props {
    children: ReactNode;
    requiredRole?: UserRole;
    requiredPermission?: string;
    fallbackPath?: string;
}

export function ProtectedRoute({
                                   children,
                                   requiredRole,
                                   requiredPermission,
                                   fallbackPath = '/unauthorized'
                               }: Props) {

    const { status, user, hasPermission, hasRole } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // 使用 useCallback 包装权限检查函数
    const checkAuthorization = useCallback(() => {
        if (!user) return false;

        // 检查角色
        if (requiredRole && !hasRole(requiredRole)) {
            return false;
        }

        // 检查具体权限
        return !(requiredPermission && !hasPermission(requiredPermission));


    }, [user, requiredRole, requiredPermission, hasRole, hasPermission]);

    useEffect(() => {
        // 如果已认证但权限不足，重定向到未授权页面
        if (status === 'authenticated' && !checkAuthorization()) {
            navigate(fallbackPath, { replace: true });
        }
    }, [status, checkAuthorization, navigate, fallbackPath]);

    if (status === 'loading') {
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
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    // 权限检查不通过，不渲染内容（会在useEffect中重定向）
    if (!checkAuthorization()) {
        return null;
    }

    return <>{children}</>;
}