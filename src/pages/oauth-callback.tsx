import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

export default function OAuthCallbackHandler() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // 存储 access_token
            localStorage.setItem('access_token', token);

            // 去首页，替换历史记录，避免 token 残留在地址栏
            navigate('/', { replace: true });
        }
    }, [location, navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // 居中占满全屏
            }}
        >
            <CircularProgress />
        </Box>
    );
}
