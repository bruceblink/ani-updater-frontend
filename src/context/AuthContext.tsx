import axios from 'axios';
import {
    useState,
    useEffect,
    useContext,
    useCallback,
    createContext,
    type ReactNode,
} from 'react';

import api, { setOnAuthInvalid } from 'src/utils/api';

/* ================== Types ================== */

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
    id: string;
    username: string;
    roles: UserRole;
    permissions?: string[];
}

interface AuthContextType {
    status: AuthStatus;
    user: User | null;

    /** 手动刷新用户信息（如：登录后） */
    refreshUser: () => Promise<void>;

    /** 权限判断 */
    hasPermission: (permission: string) => boolean;

    /** 角色判断 */
    hasRole: (role: UserRole | UserRole[]) => boolean;
}

/* ================== Context ================== */

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
};

/* ================== Provider ================== */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [status, setStatus] = useState<AuthStatus>('loading');
    const [user, setUser] = useState<User | null>(null);

    /* ---------- 核心：拉取当前用户 ---------- */
    const fetchMe = useCallback(async () => {
        try {
            const res = await api.get('/api/me');

            const data = res.data?.data;
            if (!data) throw new Error('Invalid /api/me response');

            setUser({
                id: data.id,
                username: data.username,
                roles: data.roles ?? 'user',
                permissions: data.permissions ?? [],
            });
            setStatus('authenticated');
        } catch (err: any) {
            if (axios.isCancel(err)) return;

            // 401 / refresh 失败 / cookie 失效
            if (err.response?.status === 401) {
                setUser(null);
                setStatus('unauthenticated');
            } else {
                console.error('fetchMe failed:', err);
                setUser(null);
                setStatus('unauthenticated');
            }
        }
    }, []);

    /* ---------- 初始化鉴权 ---------- */
    useEffect(() => {
        const controller = new AbortController();

        // axios 刷新失败 / 401 → 统一失效
        setOnAuthInvalid(() => {
            setUser(null);
            setStatus('unauthenticated');
        });

        void fetchMe();

        return () => {
            controller.abort();
            setOnAuthInvalid(null);
        };
    }, [fetchMe]);

    /* ---------- 权限判断 ---------- */
    const hasPermission = (permission: string): boolean => {
        // 🔑 没有 permissions 视为「未启用权限系统」
        if (!user || !user.permissions || user.permissions.length === 0) {
            return false;
        }
        return user.permissions.includes(permission);
    };

    /* ---------- 角色判断 ---------- */
    const hasRole = useCallback(
        (role: UserRole | UserRole[]): boolean => {
            if (!user) return false;
            if (Array.isArray(role)) {
                return role.includes(user.roles);
            }
            return user.roles === role;
        },
        [user]
    );

    return (
        <AuthContext.Provider
            value={{
                status,
                user,
                refreshUser: fetchMe,
                hasPermission,
                hasRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};