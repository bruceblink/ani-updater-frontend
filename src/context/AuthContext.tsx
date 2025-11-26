import axios from 'axios';
import { useState, useEffect, useContext, createContext, type ReactNode } from 'react';

import api, { setOnAuthInvalid, schedulePreRefresh } from 'src/utils/api';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
export type UserRole = 'admin' | 'user' | 'guest'; // 根据你的后端调整

interface User {
    id: string;
    email: string;
    role: UserRole;
    permissions?: string[];
}

interface AuthContextType {
    status: AuthStatus;
    user: User | null;
    setStatus: (status: AuthStatus) => void;
    setUser: (user: User | null) => void;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType>({
    status: 'loading',
    user: null,
    setStatus: () => {},
    setUser: () => {},
    hasPermission: () => false,
    hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [status, setStatus] = useState<AuthStatus>('loading');
    const [user, setUser] = useState<User | null>(null);

    const hasPermission = (permission: string): boolean => {
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
    };

    const hasRole = (role: UserRole): boolean => {
        if (!user) return false;
        return user.role === role;
    };

    useEffect(() => {
        const controller = new AbortController();

        // 刷新失败 → 标记未登录（外层路由可据此跳转登录页）
        setOnAuthInvalid(() => {
            setStatus('unauthenticated');
            setUser(null);
            localStorage.removeItem('access_token');
        });

        const checkAuth = async () => {
            try {
                const res = await api.get('/api/me', { signal: controller.signal });
                if (res.data?.status === 'ok') {
                    const userData = res.data.data;
                    console.log("userData: ", userData);
                    setUser({
                        id: userData.id,
                        email: userData.email,
                        role: userData.role || 'user', // 默认角色
                        permissions: userData.permissions || [],
                    });
                    setStatus('authenticated');
                }
                // 如果后端返回 access_token 的过期时间 exp，则安排预刷新
                const exp = res.data?.data?.exp;
                if (exp) {
                    await schedulePreRefresh(exp);
                }
            } catch (err: any) {
                if (axios.isCancel(err)) return;

                // 明确 401 → 未登录；其他错误你也可以按需当成未登录
                if (err.response?.status === 401) {
                    setStatus('unauthenticated');
                } else {
                    console.error('Auth check failed:', err);
                    // 也可以改成 setStatus("unauthenticated")，避免页面长期 loading
                    setStatus('unauthenticated');
                }
            }
        };

        void checkAuth();

        return () => {
            controller.abort();
            setOnAuthInvalid(null);
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            status,
            user,
            setStatus,
            setUser,
            hasPermission,
            hasRole,
        }}>
            {children}
        </AuthContext.Provider>
    );
};