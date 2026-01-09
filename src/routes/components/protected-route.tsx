import type { ReactNode } from 'react';
import type { UserRole } from 'src/context/AuthContext';

import { Navigate, useLocation } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { useAuth } from 'src/context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;

    /** 需要的角色（RBAC，第一层） */
    requiredRole?: UserRole;

    /** 需要的权限（可选，第二层） */
    requiredPermission?: string;

    /** 权限不足时跳转路径 */
    fallbackPath?: string;
}

export function ProtectedRoute({
                                   children,
                                   requiredRole,
                                   requiredPermission,
                                   fallbackPath = '/unauthorized',
                               }: ProtectedRouteProps) {
    const { status, user, hasRole, hasPermission } = useAuth();
    const location = useLocation();

    /* ========= 1. 认证状态加载中 ========= */
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

    /* ========= 2. 未登录 ========= */
    if (status === 'unauthenticated') {
        return (
            <Navigate
                to="/sign-in"
                replace
                state={{ from: location }}
            />
        );
    }

    /* ========= 3. 理论兜底（不应发生） ========= */
    if (!user) {
        return (
            <Navigate
                to="/sign-in"
                replace
                state={{ from: location }}
            />
        );
    }

    /* ========= 4. 角色校验（第一优先级） ========= */
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to={fallbackPath} replace />;
    }

    /* ========= 5. 权限校验（可选增强） ========= */
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to={fallbackPath} replace />;
    }

    /* ========= 6. 放行 ========= */
    return <>{children}</>;
}