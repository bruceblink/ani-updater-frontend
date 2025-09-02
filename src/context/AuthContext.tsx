import axios from "axios";
import { useState, useEffect, useContext, createContext, type ReactNode } from "react";

import api, { schedulePreRefresh } from "src/utils/api";

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

    const checkAuth = async () => {
      try {
        const res = await api.get("/api/me", { signal: controller.signal });
        setStatus("authenticated");

        // 如果后端返回 access_token_exp，则预刷新
        if (res.data?.access_token_exp) {
          schedulePreRefresh(res.data.access_token_exp);
        }
      } catch (err: any) {
        if (axios.isCancel(err)) return;

        // ✅ 只在明确 401 时判定未登录
        if (err.response?.status === 401) {
          setStatus("unauthenticated");
        } else {
          // 其他错误（如 500 / 网络失败）保持 loading，不会无限跳转
          console.error("Auth check failed:", err);
          setStatus("loading");
        }
      }
    };

    void checkAuth();
    return () => controller.abort();
  }, []);

  return (
    <AuthContext.Provider value={{ status, setStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
