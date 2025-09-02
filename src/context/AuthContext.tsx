import { useState, useEffect, useContext, createContext, type ReactNode } from "react";

import api, { schedulePreRefresh } from "src/utils/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
}

const AuthContext = createContext<AuthContextType>({
  status: "loading",
  setStatus: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const res = await api.get("/api/me");
        if (!mounted) return;

        setStatus("authenticated");

        // 如果后端返回 access_token_exp，则预刷新
        if (res.data?.access_token_exp) {
          schedulePreRefresh(res.data.access_token_exp);
        }
      } catch (err: any) {
        if (!mounted) return;

        // 只有刷新失败才置为 unauthenticated
        if (err._refreshFailed) {
          setStatus("unauthenticated");
        } else {
          setStatus("loading"); // 等待拦截器刷新重试
        }
      }
    };

    void checkAuth();
    return () => { mounted = false };
  }, []);

  return (
    <AuthContext.Provider value={{ status, setStatus }}>
      {children}
    </AuthContext.Provider>
  );
};