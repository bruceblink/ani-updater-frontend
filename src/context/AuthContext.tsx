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
        console.log("auth err: ",err)
        if (!mounted) return;

        // 无论是否刷新失败，401 都可以视作未登录
        setStatus("unauthenticated");
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