import axios from "axios";
import { useState, useEffect, useContext, createContext, type ReactNode } from "react";

import api, { setOnAuthInvalid, schedulePreRefresh } from "src/utils/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
}

const AuthContext = createContext<AuthContextType>({
  status: "loading",
  setStatus: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const controller = new AbortController();

    // 刷新失败 → 标记未登录（外层路由可据此跳转登录页）
    setOnAuthInvalid(() => setStatus("unauthenticated"));

    const checkAuth = async () => {
      try {
        const res = await api.get("/api/me", { signal: controller.signal });
        if (res.data?.status === "ok"){
            setStatus("authenticated");
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
          setStatus("unauthenticated");
        } else {
          console.error("Auth check failed:", err);
          // 也可以改成 setStatus("unauthenticated")，避免页面长期 loading
          setStatus("unauthenticated");
        }
      }
    };

    void checkAuth();

    return () => {
      controller.abort();
      // 组件卸载时不再接收失效回调（可选）
      setOnAuthInvalid(null);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ status, setStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
