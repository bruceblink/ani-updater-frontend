import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

export default function OAuthCallbackHandler() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/', { replace: true });
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
