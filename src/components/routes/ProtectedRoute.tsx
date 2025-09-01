import { type ReactNode} from 'react';
import { useState, useEffect} from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/me', {
          credentials: 'include', // 发送 HttpOnly cookie
        });
        setIsLoggedIn(res.ok);
      } catch (err) {
        console.error('Auth check failed', err);
        setIsLoggedIn(false);
      }
    };

    void checkAuth();
  }, []);

  if (isLoggedIn === null) return <div>加载中...</div>;

  if (!isLoggedIn) {
    // 未登录，跳转到登录页，同时记录来源页面
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
