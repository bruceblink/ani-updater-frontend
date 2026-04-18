import { alpha, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FEATURES = [
    {
        icon: 'solar:play-bold',
        title: '番剧追踪',
        description:
            '追踪在追番剧，管理个人收藏列表，支持切换观看状态（已看 / 在追 / 想看），随时掌握追番进度。',
        color: '#1877F2',
        bg: '#D0ECFE',
    },
    {
        icon: 'solar:eye-bold',
        title: '新闻聚合',
        description:
            '聚合多源互联网资讯，自动提取热点事件，支持按来源与状态筛选，快速定位感兴趣的内容。',
        color: '#7635dc',
        bg: '#EFD6FF',
    },
    {
        icon: 'eva:trending-up-fill',
        title: '数据图表',
        description:
            '以柱状图与饼图直观展示新闻热度趋势与事件状态分布，帮助您洞察资讯动态规律。',
        color: '#00b8d9',
        bg: '#CAFDF5',
    },
    {
        icon: 'solar:clock-circle-outline',
        title: '定时任务',
        description:
            '管理自动化数据抓取 Cron 任务，支持创建、编辑、删除及单任务启停，实时查看执行状态。',
        color: '#22c55e',
        bg: '#D3FCD2',
    },
];

const TECH_STACK = ['React 18', 'TypeScript', 'Vite', 'Material-UI v5', 'ApexCharts', 'GitHub OAuth'];

// ----------------------------------------------------------------------

function handleGithubLogin() {
    window.location.href = `${CONFIG.apiUrl}/auth/oauth/github/login?redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`;
}

// ----------------------------------------------------------------------

export function LandingView() {
    const theme = useTheme();

    const renderHeader = (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                bgcolor: alpha(theme.palette.background.default, 0.85),
                backdropFilter: 'blur(8px)',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                color: 'text.primary',
            }}
        >
            <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
                <Logo sx={{ mr: 1 }} />
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, letterSpacing: '-0.5px', flexGrow: 1 }}
                >
                    AniRadar
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon="socials:github" width={18} />}
                    onClick={handleGithubLogin}
                    sx={{
                        bgcolor: 'text.primary',
                        color: 'background.default',
                        '&:hover': { bgcolor: 'text.secondary' },
                        px: 2,
                    }}
                >
                    GitHub 登录
                </Button>
            </Toolbar>
        </AppBar>
    );

    const renderHero = (
        <Box
            sx={{
                pt: { xs: 14, md: 18 },
                pb: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg,
                    ${alpha(theme.palette.primary.lighter ?? '#D0ECFE', 0.6)} 0%,
                    ${alpha(theme.palette.background.default, 1)} 60%
                )`,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -120,
                    right: -120,
                    width: 480,
                    height: 480,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.light ?? '#73BAFB', 0.25)} 0%, transparent 70%)`,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -80,
                    left: -80,
                    width: 360,
                    height: 360,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha('#7635dc', 0.12)} 0%, transparent 70%)`,
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Stack spacing={4} alignItems={{ xs: 'center', md: 'flex-start' }}>
                    <Chip
                        label="番剧 · 资讯 · 数据"
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            fontWeight: 600,
                            px: 1,
                        }}
                    />

                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            lineHeight: 1.15,
                            letterSpacing: '-1px',
                            textAlign: { xs: 'center', md: 'left' },
                            maxWidth: 640,
                        }}
                    >
                        番剧追踪 · 资讯聚合
                        <Box
                            component="span"
                            sx={{ display: 'block', color: 'primary.main' }}
                        >
                            数据洞察一体化
                        </Box>
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 520,
                            textAlign: { xs: 'center', md: 'left' },
                            lineHeight: 1.8,
                            fontSize: '1.05rem',
                        }}
                    >
                        AniRadar 是一个番剧与资讯一体化管理平台，帮助您追踪在追番剧、聚合多源新闻热点、以图表分析数据趋势，让信息管理更高效。
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Iconify icon="socials:github" width={20} />}
                            onClick={handleGithubLogin}
                            sx={{
                                bgcolor: 'text.primary',
                                color: 'background.default',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                '&:hover': { bgcolor: 'text.secondary' },
                            }}
                        >
                            使用 GitHub 登录
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            href="#features"
                            sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                        >
                            查看功能
                        </Button>
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {TECH_STACK.map((tech) => (
                            <Chip
                                key={tech}
                                label={tech}
                                size="small"
                                variant="outlined"
                                sx={{ color: 'text.secondary', borderColor: 'divider' }}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );

    const renderFeatures = (
        <Box
            id="features"
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: alpha(theme.palette.background.neutral ?? theme.palette.grey[100], 0.5),
            }}
        >
            <Container maxWidth="lg">
                <Stack spacing={2} alignItems="center" sx={{ mb: { xs: 6, md: 8 } }}>
                    <Typography
                        variant="overline"
                        sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}
                    >
                        核心功能
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{ fontWeight: 800, textAlign: 'center', letterSpacing: '-0.5px' }}
                    >
                        一站式管理，效率倍增
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 480 }}
                    >
                        从番剧追踪到资讯聚合，从数据图表到定时任务，AniRadar 覆盖您的全部需求
                    </Typography>
                </Stack>

                <Grid container spacing={3}>
                    {FEATURES.map((feature) => (
                        <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    border: `1px solid ${alpha(feature.color, 0.12)}`,
                                    boxShadow: 'none',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 12px 32px ${alpha(feature.color, 0.16)}`,
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: 2,
                                            bgcolor: feature.bg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2.5,
                                        }}
                                    >
                                        <Iconify
                                            icon={feature.icon}
                                            width={26}
                                            sx={{ color: feature.color }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 700, mb: 1.5 }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', lineHeight: 1.75 }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );

    const renderCTA = (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                background: `linear-gradient(135deg,
                    ${theme.palette.primary.dark ?? '#0C44AE'} 0%,
                    ${theme.palette.primary.main} 100%
                )`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -80,
                    right: -80,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: alpha('#fff', 0.06),
                },
            }}
        >
            <Container maxWidth="md">
                <Stack spacing={3} alignItems="center">
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            color: '#fff',
                            textAlign: 'center',
                            letterSpacing: '-0.5px',
                        }}
                    >
                        立即开始使用 AniRadar
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: alpha('#fff', 0.75), textAlign: 'center', maxWidth: 420 }}
                    >
                        使用 GitHub 账号一键登录，无需注册，免费使用全部功能
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Iconify icon="socials:github" width={22} />}
                        onClick={handleGithubLogin}
                        sx={{
                            bgcolor: '#fff',
                            color: 'primary.main',
                            px: 5,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 700,
                            '&:hover': { bgcolor: alpha('#fff', 0.9) },
                        }}
                    >
                        GitHub 一键登录
                    </Button>
                </Stack>
            </Container>
        </Box>
    );

    const renderFooter = (
        <Box
            component="footer"
            sx={{
                py: 4,
                bgcolor: 'background.default',
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Logo isSingle sx={{ width: 28, height: 28 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            © {new Date().getFullYear()} AniRadar. All rights reserved.
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                        <Typography
                            component="a"
                            href="https://github.com/bruceblink/Agora"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'text.primary' } }}
                        >
                            后端项目
                        </Typography>
                        <Typography
                            component="a"
                            href="https://github.com/bruceblink/ani-updater-frontend"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'text.primary' } }}
                        >
                            前端项目
                        </Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {renderHeader}
            <Box component="main" sx={{ flexGrow: 1 }}>
                {renderHero}
                {renderFeatures}
                {renderCTA}
            </Box>
            {renderFooter}
        </Box>
    );
}
