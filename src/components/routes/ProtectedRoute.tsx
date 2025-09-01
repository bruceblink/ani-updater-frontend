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
    fetch('http://localhost:8000/me', { credentials: 'include' })
      .then(res => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) return <div>加载中...</div>;

  if (!isLoggedIn) {
    // 未登录，跳转到登录页，同时记录来源页面
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
