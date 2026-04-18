import type { IconifyName } from 'src/components/iconify';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { useNewsSse } from 'src/hooks/useNewsSse';

// ----------------------------------------------------------------------

const FEATURES: { icon: IconifyName; title: string; description: string; color: string; bg: string }[] = [
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

// 来源 → 主色 映射
const SOURCE_COLOR: Record<string, string> = {
    NGA: '#1877F2',
    Bilibili: '#00A1D6',
    AcFun: '#F5413F',
};

function sourceColor(from: string): string {
    return SOURCE_COLOR[from] ?? '#7635dc';
}

// ----------------------------------------------------------------------

export function LandingView() {
    const theme = useTheme();

    // SSE 新闻流（无需登录，公开推送）
    const { items: timelineItems, status: sseStatus, error: sseError } = useNewsSse(20);
    const newsLoading = sseStatus === 'connecting';

    // 最新推送条目自动高亮轮播
    const [activeIdx, setActiveIdx] = useState(0);
    useEffect(() => {
        if (!timelineItems.length) return undefined;
        // 每次新条目推入时，将高亮重置到顶部（最新）
        setActiveIdx(0);
        const timer = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % timelineItems.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [timelineItems.length]);

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
                <Box
                    component="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    sx={{ width: 32, height: 32, mr: 1, flexShrink: 0 }}
                >
                    <defs>
                        <linearGradient id="ani-logo-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#9C27B0" />
                            <stop offset="100%" stopColor="#E040FB" />
                        </linearGradient>
                    </defs>
                    <circle cx="16" cy="16" r="15" fill="url(#ani-logo-g1)" />
                    <polygon
                        points="16,5 18.94,12.27 26.71,12.27 20.54,16.88 22.94,24.09 16,19.27 9.06,24.09 11.46,16.88 5.29,12.27 13.06,12.27"
                        fill="white"
                        opacity="0.95"
                    />
                </Box>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, letterSpacing: '-0.5px', flexGrow: 1 }}
                >
                    AniRadar
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon="mdi:github" width={18} />}
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
                        <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
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
                        AniRadar
                        是一个番剧与资讯一体化管理平台，帮助您追踪在追番剧、聚合多源新闻热点、以图表分析数据趋势，让信息管理更高效。
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Iconify icon="mdi:github" width={20} />}
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

    const renderNewsTimeline = (
        <Box
            id="news-timeline"
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.default',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -60,
                    right: -60,
                    width: 320,
                    height: 320,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha('#7635dc', 0.08)} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="md">
                <Stack spacing={2} alignItems="center" sx={{ mb: { xs: 6, md: 8 } }}>
                    <Typography
                        variant="overline"
                        sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}
                    >
                        实时新闻
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{ fontWeight: 800, textAlign: 'center', letterSpacing: '-0.5px' }}
                    >
                        热点资讯，实时推送
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 480 }}
                    >
                        聚合多源互联网热门资讯，随时掌握最新动态
                    </Typography>
                    {/* SSE 连接状态指示器 */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor:
                                    sseStatus === 'connected'
                                        ? '#22c55e'
                                        : sseStatus === 'reconnecting'
                                          ? '#f59e0b'
                                          : 'text.disabled',
                                boxShadow:
                                    sseStatus === 'connected'
                                        ? `0 0 0 3px ${alpha('#22c55e', 0.25)}`
                                        : 'none',
                                animation: sseStatus === 'connected' ? 'pulse 2s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.4 },
                                },
                            }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                            {sseStatus === 'connected' &&
                                `实时推送中 · 已收 ${timelineItems.length} 条`}
                            {sseStatus === 'connecting' && '正在连接实时流…'}
                            {sseStatus === 'reconnecting' && (sseError ?? '重新连接中…')}
                            {sseStatus === 'closed' && '推送已停止'}
                        </Typography>
                    </Stack>
                </Stack>

                {newsLoading ? (
                    <Stack spacing={2}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Stack key={i} direction="row" spacing={2} alignItems="center">
                                <Skeleton variant="circular" width={12} height={12} />
                                <Skeleton variant="rounded" width="100%" height={40} />
                            </Stack>
                        ))}
                    </Stack>
                ) : (
                    <Timeline
                        sx={{
                            p: 0,
                            [`& .MuiTimelineItem-root:before`]: { flex: 0, p: 0 },
                        }}
                    >
                        {timelineItems.map((item, idx) => {
                            const isActive = idx === activeIdx;
                            const color = sourceColor(item.newsFrom);
                            return (
                                <TimelineItem key={item.id}>
                                    <TimelineOppositeContent
                                        sx={{
                                            flex: '0 0 90px',
                                            pr: 2,
                                            pt: 1.2,
                                            display: { xs: 'none', sm: 'block' },
                                        }}
                                    >
                                        <Chip
                                            label={item.category}
                                            size="small"
                                            sx={{
                                                bgcolor: alpha(color, 0.1),
                                                color,
                                                fontWeight: 600,
                                                fontSize: '0.65rem',
                                                height: 20,
                                            }}
                                        />
                                    </TimelineOppositeContent>

                                    <TimelineSeparator>
                                        <TimelineDot
                                            sx={{
                                                bgcolor: isActive ? color : alpha(color, 0.3),
                                                width: isActive ? 14 : 10,
                                                height: isActive ? 14 : 10,
                                                boxShadow: isActive
                                                    ? `0 0 0 4px ${alpha(color, 0.18)}`
                                                    : 'none',
                                                transition: 'all 0.4s ease',
                                                m: '6px 0',
                                            }}
                                        />
                                        {idx < timelineItems.length - 1 && (
                                            <TimelineConnector
                                                sx={{
                                                    bgcolor: alpha(color, 0.15),
                                                    width: 2,
                                                }}
                                            />
                                        )}
                                    </TimelineSeparator>

                                    <TimelineContent sx={{ py: 0.5, px: 2, pb: 2 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 1.5,
                                                bgcolor: isActive
                                                    ? alpha(color, 0.06)
                                                    : 'transparent',
                                                border: `1px solid ${isActive ? alpha(color, 0.2) : 'transparent'}`,
                                                transition: 'all 0.4s ease',
                                            }}
                                        >
                                            <Link
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                underline="hover"
                                                sx={{
                                                    color: isActive ? color : 'text.primary',
                                                    fontWeight: isActive ? 700 : 400,
                                                    fontSize: '0.9rem',
                                                    lineHeight: 1.5,
                                                    transition: 'color 0.3s',
                                                    display: 'block',
                                                }}
                                            >
                                                {item.title}
                                            </Link>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                sx={{ mt: 0.5 }}
                                            >
                                                <Iconify
                                                    icon="solar:clock-circle-outline"
                                                    width={12}
                                                    sx={{ color: 'text.disabled' }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: 'text.disabled' }}
                                                >
                                                    {item.newsFrom} · {item.newsDate}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </TimelineContent>
                                </TimelineItem>
                            );
                        })}
                    </Timeline>
                )}

                {!newsLoading && timelineItems.length === 0 && (
                    <Stack alignItems="center" spacing={1} sx={{ py: 6 }}>
                        <Iconify
                            icon="solar:shield-warning-outline"
                            width={40}
                            sx={{ color: 'text.disabled' }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                            {sseStatus === 'reconnecting'
                                ? (sseError ?? '正在重新连接…')
                                : '等待服务端推送新闻…'}
                        </Typography>
                    </Stack>
                )}

                <Stack alignItems="center" sx={{ mt: 5 }}>
                    <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<Iconify icon="solar:arrow-right-bold" width={18} />}
                        onClick={handleGithubLogin}
                        sx={{ px: 4 }}
                    >
                        登录查看全部资讯
                    </Button>
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
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
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
                        startIcon={<Iconify icon="mdi:github" width={22} />}
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
                        <Box
                            component="svg"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            sx={{ width: 28, height: 28, flexShrink: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="ani-footer-g1"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stopColor="#9C27B0" />
                                    <stop offset="100%" stopColor="#E040FB" />
                                </linearGradient>
                            </defs>
                            <circle cx="16" cy="16" r="15" fill="url(#ani-footer-g1)" />
                            <polygon
                                points="16,5 18.94,12.27 26.71,12.27 20.54,16.88 22.94,24.09 16,19.27 9.06,24.09 11.46,16.88 5.29,12.27 13.06,12.27"
                                fill="white"
                                opacity="0.95"
                            />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            © {new Date().getFullYear()} AniRadar. All rights reserved.
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={2}
                        divider={<Divider orientation="vertical" flexItem />}
                    >
                        <Typography
                            component="a"
                            href="https://github.com/bruceblink/Agora"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                '&:hover': { color: 'text.primary' },
                            }}
                        >
                            后端项目
                        </Typography>
                        <Typography
                            component="a"
                            href="https://github.com/bruceblink/AniRadar"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                '&:hover': { color: 'text.primary' },
                            }}
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
                {renderNewsTimeline}
                {renderFeatures}
                {renderCTA}
            </Box>
            {renderFooter}
        </Box>
    );
}
