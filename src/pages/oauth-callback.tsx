import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

import { useAuth } from 'src/context/AuthContext';

export default function OAuthCallbackHandler() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    useEffect(() => {
        // 先刷新认证状态（后端已通过 302 redirect 携带 cookie 设置完毕），
        // 成功后再导航到 dashboard；失败则跳回登录页。
        refreshUser()
            .then(() => {
                navigate('/dashboard', { replace: true });
            })
            .catch(() => {
                navigate('/sign-in', { replace: true });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
