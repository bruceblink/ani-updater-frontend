import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { ProtectedRoute } from 'src/routes/components/protected-route';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import OAuthCallbackHandler from 'src/pages/oauth-callback';

import { ChartsView } from '../sections/charts/view';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const AnimePage = lazy(() => import('src/pages/anime'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ChartsPage = lazy(() => import('src/pages/charts'));
export const NewsPage = lazy(() => import('src/pages/news'));
export const NewsAnalytics = lazy(() => import('src/pages/news-analytics'));
export const ScheduledTasksPage = lazy(() => import('src/pages/scheduled-tasks'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Page403 = lazy(() => import('src/pages/page-not-access'));

const renderFallback = () => (
    <Box
        sx={{
            display: 'flex',
            flex: '1 1 auto',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            }}
        />
    </Box>
);

export const routesSection: RouteObject[] = [
    // 需要登录的路由组
    {
        element: (
            <ProtectedRoute>
                <DashboardLayout>
                    <Suspense fallback={renderFallback()}>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <DashboardPage /> },
            /*{ path: 'user', element: <UserPage /> },*/
            { path: 'charts', element: <ProtectedRoute requiredRole="admin"> <ChartsView /> </ProtectedRoute>},
            { path: 'animes', element: <AnimePage /> },
            { path: 'news', element: <NewsPage /> },
            { path: 'scheduledTasks', element: <ProtectedRoute requiredRole="admin"> <ScheduledTasksPage /> </ProtectedRoute>},
        ],
    },
    // 无需登录的路由 - 直接渲染，不加任何包装
    {
        path: 'sign-in',
        element: (
            <AuthLayout>
                <SignInPage />
            </AuthLayout>
        ),
    },
    {
        path: 'auth/callback', // ✅ GitHub OAuth 登录回调
        element: <OAuthCallbackHandler />,
    },
    // 新增其他公开页面示例
    {
        path: 'about',
        element: (
            <div>
                <h1>关于我们</h1>
                <p>这是一个公开页面，任何人都可以访问</p>
            </div>
        ),
    },
    // 公开的analyticsNews页面
    {
        path: 'analyticsNews',
        element: <NewsAnalytics />
    },
    {
        path: '404',
        element: <Page404 />,
    },
    {
        path: '403',
        element: <Page403 />,
    },
    {
        path: 'unauthorized',
        element: <Page403 />,
    },
    { path: '*', element: <Page404 /> },
];
