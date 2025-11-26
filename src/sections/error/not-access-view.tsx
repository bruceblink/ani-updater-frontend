import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

export function NotAccessView() {
    return (
        <>
            <Logo sx={{ position: 'fixed', top: 20, left: 20 }} />

            <Container
                sx={{
                    py: 10,
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h3" sx={{ mb: 2 }}>
                    Access Denied
                </Typography>

                <Typography sx={{ color: 'text.secondary', maxWidth: 480, textAlign: 'center' }}>
                    You don&#39;t have permission to access this page. This might be because:
                </Typography>

                <Box sx={{ my: 3, textAlign: 'left', maxWidth: 400 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        • You are not signed in
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        • Your account doesn&#39;t have the required permissions
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        • The page has been moved or removed
                    </Typography>
                </Box>

                <Box
                    component="img"
                    src="/assets/illustrations/illustration-403.svg"
                    sx={{
                        width: 320,
                        height: 'auto',
                        my: { xs: 5, sm: 10 },
                    }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        component={RouterLink}
                        href="/sign-in"
                        size="large"
                        variant="outlined"
                        color="primary"
                    >
                        Sign In
                    </Button>
                    <Button
                        component={RouterLink}
                        href="/"
                        size="large"
                        variant="contained"
                        color="primary"
                    >
                        Go to Home
                    </Button>
                </Box>
            </Container>
        </>
    );
}