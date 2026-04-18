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

const STATS: { icon: IconifyName; value: string; label: string; color: string }[] = [
    { icon: 'solar:eye-bold', value: '4+', label: '聚合数据来源', color: '#7635dc' },
    { icon: 'solar:bell-bing-bold-duotone', value: 'SSE', label: '实时事件推送', color: '#00b8d9' },
    { icon: 'eva:trending-up-fill', value: '多维', label: '可视化图表', color: '#f59e0b' },
    {
        icon: 'solar:clock-circle-outline',
        value: 'Cron',
        label: '全自动定时抓取',
        color: '#22c55e',
    },
];

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

// 可复用的 AniRadar 星形 Logo
function AniLogo({ size = 32 }: { size?: number }) {
    return (
        <Box
            component="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            sx={{ width: size, height: size, flexShrink: 0 }}
        >
            <defs>
                <linearGradient id="ani-logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9C27B0" />
                    <stop offset="100%" stopColor="#E040FB" />
                </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="15" fill="url(#ani-logo-g)" />
            <polygon
                points="16,5 18.94,12.27 26.71,12.27 20.54,16.88 22.94,24.09 16,19.27 9.06,24.09 11.46,16.88 5.29,12.27 13.06,12.27"
                fill="white"
                opacity="0.95"
            />
        </Box>
    );
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
                bgcolor: alpha(theme.palette.background.default, 0.88),
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                color: 'text.primary',
            }}
        >
            <Toolbar sx={{ px: { xs: 2, md: 4 }, gap: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <AniLogo size={32} />
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                        AniRadar
                    </Typography>
                </Stack>

                {/* Nav links - desktop only */}
                <Stack
                    direction="row"
                    spacing={3}
                    sx={{ flexGrow: 1, ml: 4, display: { xs: 'none', md: 'flex' } }}
                >
                    {[
                        { label: '核心功能', href: '#features' },
                        { label: '实时资讯', href: '#news-timeline' },
                    ].map((nav) => (
                        <Link
                            key={nav.href}
                            href={nav.href}
                            underline="none"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                transition: 'color 0.2s',
                                '&:hover': { color: 'text.primary' },
                            }}
                        >
                            {nav.label}
                        </Link>
                    ))}
                </Stack>

                <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

                <Button
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon="mdi:github" width={18} />}
                    onClick={handleGithubLogin}
                    sx={{
                        bgcolor: 'text.primary',
                        color: 'background.default',
                        '&:hover': { bgcolor: 'text.secondary' },
                        px: 2.5,
                        borderRadius: 2,
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
                pt: { xs: 12, md: 14 },
                pb: { xs: 8, md: 10 },
                minHeight: { md: '88vh' },
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(150deg,
                    ${alpha(theme.palette.primary.lighter ?? '#EBD6FD', 0.5)} 0%,
                    ${alpha(theme.palette.background.default, 0.95)} 55%,
                    ${alpha('#CAFDF5', 0.3)} 100%
                )`,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -160,
                    right: -160,
                    width: 560,
                    height: 560,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha('#7635dc', 0.18)} 0%, transparent 65%)`,
                    pointerEvents: 'none',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -100,
                    left: -60,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha('#00b8d9', 0.1)} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
                    {/* Left: text content */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={4}>
                            <Chip
                                icon={
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            bgcolor: '#22c55e',
                                            ml: 1,
                                        }}
                                    />
                                }
                                label="SSE 实时推送 · 无需登录"
                                size="small"
                                sx={{
                                    width: 'fit-content',
                                    bgcolor: alpha('#22c55e', 0.1),
                                    color: '#22c55e',
                                    fontWeight: 600,
                                    px: 0.5,
                                    border: `1px solid ${alpha('#22c55e', 0.25)}`,
                                }}
                            />

                            <Box>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontWeight: 900,
                                        fontSize: { xs: '2.4rem', md: '3.2rem' },
                                        lineHeight: 1.1,
                                        letterSpacing: '-1.5px',
                                    }}
                                >
                                    番剧追踪
                                    <Box
                                        component="span"
                                        sx={{
                                            display: 'block',
                                            background: `linear-gradient(90deg, #9C27B0, #E040FB 60%, #00b8d9)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        资讯聚合
                                    </Box>
                                    数据洞察
                                </Typography>
                            </Box>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    maxWidth: 480,
                                    lineHeight: 1.9,
                                    fontSize: '1.05rem',
                                }}
                            >
                                AniRadar
                                是一个番剧与资讯一体化管理平台。追踪在追番剧、实时聚合多源新闻、图表分析趋势——让您的信息管理更高效。
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
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: 'text.secondary' },
                                    }}
                                >
                                    使用 GitHub 登录
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    href="#features"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        borderColor: alpha(theme.palette.primary.main, 0.4),
                                        color: 'primary.main',
                                    }}
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
                                        sx={{
                                            color: 'text.secondary',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Right: live SSE preview panel */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Box
                            sx={{
                                borderRadius: 3,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                                bgcolor: alpha(theme.palette.background.paper, 0.75),
                                backdropFilter: 'blur(16px)',
                                p: 3,
                                boxShadow: `0 24px 64px ${alpha('#7635dc', 0.14)}`,
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* macOS-style traffic lights */}
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mb: 2.5 }}
                            >
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            bgcolor: '#ff5f57',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            bgcolor: '#febc2e',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            bgcolor: '#28c840',
                                        }}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                    <Box
                                        sx={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: '50%',
                                            bgcolor:
                                                sseStatus === 'connected' ? '#22c55e' : '#f59e0b',
                                            animation:
                                                sseStatus === 'connected'
                                                    ? 'hero-live 2s infinite'
                                                    : 'none',
                                            '@keyframes hero-live': {
                                                '0%, 100%': { opacity: 1 },
                                                '50%': { opacity: 0.3 },
                                            },
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{ color: 'text.disabled', fontSize: '0.72rem' }}
                                    >
                                        实时新闻预览
                                    </Typography>
                                </Stack>
                            </Stack>

                            {/* Live news list */}
                            <Stack spacing={1.25}>
                                {newsLoading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                          <Stack
                                              key={i}
                                              direction="row"
                                              spacing={1.5}
                                              alignItems="flex-start"
                                          >
                                              <Skeleton
                                                  variant="circular"
                                                  width={8}
                                                  height={8}
                                                  sx={{ mt: 0.6, flexShrink: 0 }}
                                              />
                                              <Skeleton variant="text" width="85%" height={18} />
                                          </Stack>
                                      ))
                                    : timelineItems.slice(0, 7).map((item, i) => {
                                          const color = sourceColor(item.newsFrom);
                                          const isTop = i === 0;
                                          return (
                                              <Stack
                                                  key={item.id}
                                                  direction="row"
                                                  spacing={1.5}
                                                  alignItems="flex-start"
                                                  sx={{
                                                      p: 1,
                                                      borderRadius: 1.5,
                                                      bgcolor: isTop
                                                          ? alpha(color, 0.06)
                                                          : 'transparent',
                                                      border: `1px solid ${isTop ? alpha(color, 0.15) : 'transparent'}`,
                                                      transition: 'all 0.3s',
                                                  }}
                                              >
                                                  <Box
                                                      sx={{
                                                          width: 7,
                                                          height: 7,
                                                          borderRadius: '50%',
                                                          bgcolor: color,
                                                          flexShrink: 0,
                                                          mt: 0.65,
                                                      }}
                                                  />
                                                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                      <Typography
                                                          variant="caption"
                                                          sx={{
                                                              display: 'block',
                                                              color: isTop
                                                                  ? 'text.primary'
                                                                  : 'text.secondary',
                                                              fontWeight: isTop ? 600 : 400,
                                                              lineHeight: 1.5,
                                                              overflow: 'hidden',
                                                              textOverflow: 'ellipsis',
                                                              whiteSpace: 'nowrap',
                                                              fontSize: '0.78rem',
                                                          }}
                                                      >
                                                          {item.title}
                                                      </Typography>
                                                      <Typography
                                                          variant="caption"
                                                          sx={{
                                                              color: 'text.disabled',
                                                              fontSize: '0.68rem',
                                                          }}
                                                      >
                                                          {item.newsFrom} · {item.category}
                                                      </Typography>
                                                  </Box>
                                              </Stack>
                                          );
                                      })}
                                {timelineItems.length === 0 && !newsLoading && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'text.disabled',
                                            textAlign: 'center',
                                            py: 4,
                                            display: 'block',
                                        }}
                                    >
                                        等待服务端推送…
                                    </Typography>
                                )}
                            </Stack>

                            {/* Footer caption */}
                            <Box
                                sx={{
                                    mt: 2.5,
                                    pt: 2,
                                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.disabled', fontSize: '0.7rem' }}
                                >
                                    ↑ 真实数据 · SSE 实时推送 · 无需登录即可预览
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );

    const renderStats = (
        <Box
            sx={{
                py: { xs: 4, md: 5 },
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                bgcolor: alpha(theme.palette.background.neutral ?? theme.palette.grey[50], 0.5),
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 3, md: 2 }}>
                    {STATS.map((stat) => (
                        <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        bgcolor: alpha(stat.color, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Iconify
                                        icon={stat.icon}
                                        width={22}
                                        sx={{ color: stat.color }}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 800, lineHeight: 1.2, color: stat.color }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
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
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: -80,
                    transform: 'translateY(-50%)',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha('#7635dc', 0.06)} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">
                    {/* Left: sticky intro */}
                    <Grid
                        size={{ xs: 12, md: 4 }}
                        sx={{ position: { md: 'sticky' }, top: { md: 96 } }}
                    >
                        <Stack spacing={3}>
                            <Typography
                                variant="overline"
                                sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}
                            >
                                实时新闻
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: '-0.5px',
                                    lineHeight: 1.25,
                                }}
                            >
                                热点资讯
                                <Box
                                    component="span"
                                    sx={{ display: 'block', color: 'primary.main' }}
                                >
                                    实时推送
                                </Box>
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', lineHeight: 1.85 }}
                            >
                                聚合 NGA、Bilibili、AcFun 等多源互联网热门资讯，通过 SSE
                                流实时推送到您的浏览器，无需刷新页面。
                            </Typography>

                            {/* SSE 状态卡片 */}
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    bgcolor:
                                        sseStatus === 'connected'
                                            ? alpha('#22c55e', 0.06)
                                            : alpha('#f59e0b', 0.06),
                                    border: `1px solid ${
                                        sseStatus === 'connected'
                                            ? alpha('#22c55e', 0.2)
                                            : alpha('#f59e0b', 0.2)
                                    }`,
                                }}
                            >
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
                                            animation:
                                                sseStatus === 'connected'
                                                    ? 'sse-pulse 2s infinite'
                                                    : 'none',
                                            '@keyframes sse-pulse': {
                                                '0%, 100%': { opacity: 1 },
                                                '50%': { opacity: 0.3 },
                                            },
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 600,
                                            color:
                                                sseStatus === 'connected' ? '#22c55e' : '#f59e0b',
                                        }}
                                    >
                                        {sseStatus === 'connected' &&
                                            `实时推送中 · 已收 ${timelineItems.length} 条`}
                                        {sseStatus === 'connecting' && '正在建立连接…'}
                                        {sseStatus === 'reconnecting' &&
                                            (sseError ?? '重新连接中…')}
                                        {sseStatus === 'closed' && '推送已停止'}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Right: timeline list */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        {newsLoading ? (
                            <Stack spacing={2.5}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Stack
                                        key={i}
                                        direction="row"
                                        spacing={2}
                                        alignItems="flex-start"
                                    >
                                        <Stack alignItems="center" spacing={1}>
                                            <Skeleton variant="circular" width={12} height={12} />
                                            <Skeleton variant="rectangular" width={2} height={48} />
                                        </Stack>
                                        <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                                            <Skeleton variant="rounded" width="90%" height={20} />
                                            <Skeleton variant="rounded" width="40%" height={16} />
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        ) : (
                            <Timeline
                                sx={{
                                    p: 0,
                                    m: 0,
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
                                                    flex: '0 0 84px',
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
                                                        borderRadius: 1,
                                                    }}
                                                />
                                            </TimelineOppositeContent>

                                            <TimelineSeparator>
                                                <TimelineDot
                                                    sx={{
                                                        bgcolor: isActive
                                                            ? color
                                                            : alpha(color, 0.3),
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

                                            <TimelineContent sx={{ py: 0.5, px: 2, pb: 2.5 }}>
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: isActive
                                                            ? alpha(color, 0.05)
                                                            : 'transparent',
                                                        border: `1px solid ${isActive ? alpha(color, 0.18) : 'transparent'}`,
                                                        transition: 'all 0.4s ease',
                                                    }}
                                                >
                                                    <Link
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        underline="hover"
                                                        sx={{
                                                            color: isActive
                                                                ? color
                                                                : 'text.primary',
                                                            fontWeight: isActive ? 700 : 400,
                                                            fontSize: '0.9rem',
                                                            lineHeight: 1.6,
                                                            transition: 'color 0.3s',
                                                            display: 'block',
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <Stack
                                                        direction="row"
                                                        spacing={0.75}
                                                        alignItems="center"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        <Iconify
                                                            icon="solar:clock-circle-outline"
                                                            width={11}
                                                            sx={{ color: 'text.disabled' }}
                                                        />
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: 'text.disabled',
                                                                fontSize: '0.72rem',
                                                            }}
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
                            <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
                                <Iconify
                                    icon="solar:shield-warning-outline"
                                    width={48}
                                    sx={{ color: 'text.disabled' }}
                                />
                                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                                    {sseStatus === 'reconnecting'
                                        ? (sseError ?? '正在重新连接…')
                                        : '等待服务端推送新闻…'}
                                </Typography>
                            </Stack>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );

    const renderFeatures = (
        <Box
            id="features"
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: alpha(theme.palette.background.neutral ?? theme.palette.grey[100], 0.6),
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -80,
                    right: -80,
                    width: 360,
                    height: 360,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha('#00b8d9', 0.07)} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                },
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
                    {FEATURES.map((feature, index) => (
                        <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    border: `1px solid ${alpha(feature.color, 0.1)}`,
                                    boxShadow: 'none',
                                    background: `linear-gradient(145deg, ${alpha(feature.bg, 0.6)}, ${alpha(theme.palette.background.paper, 0.95)})`,
                                    transition: 'transform 0.25s, box-shadow 0.25s',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: `0 16px 40px ${alpha(feature.color, 0.18)}`,
                                    },
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        sx={{ mb: 2.5 }}
                                    >
                                        <Box
                                            sx={{
                                                width: 52,
                                                height: 52,
                                                borderRadius: 2,
                                                bgcolor: feature.bg,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Iconify
                                                icon={feature.icon}
                                                width={26}
                                                sx={{ color: feature.color }}
                                            />
                                        </Box>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 800,
                                                color: alpha(feature.color, 0.15),
                                                lineHeight: 1,
                                            }}
                                        >
                                            0{index + 1}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            lineHeight: 1.8,
                                            flexGrow: 1,
                                        }}
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
                py: { xs: 10, md: 16 },
                background: `linear-gradient(135deg, #4A0072 0%, #7635dc 50%, #00b8d9 100%)`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: alpha('#fff', 0.05),
                    pointerEvents: 'none',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -80,
                    left: -80,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: alpha('#fff', 0.04),
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Stack spacing={4} alignItems="center">
                    <AniLogo size={56} />
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            color: '#fff',
                            textAlign: 'center',
                            letterSpacing: '-1px',
                            lineHeight: 1.15,
                        }}
                    >
                        立即开始使用
                        <Box component="span" sx={{ display: 'block', opacity: 0.85 }}>
                            AniRadar
                        </Box>
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: alpha('#fff', 0.7),
                            textAlign: 'center',
                            maxWidth: 420,
                            lineHeight: 1.8,
                        }}
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
                            color: '#7635dc',
                            px: 6,
                            py: 1.75,
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            borderRadius: 2,
                            boxShadow: `0 8px 24px ${alpha('#000', 0.2)}`,
                            '&:hover': { bgcolor: alpha('#fff', 0.92) },
                        }}
                    >
                        GitHub 一键登录
                    </Button>
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        justifyContent="center"
                        useFlexGap
                    >
                        {TECH_STACK.map((tech) => (
                            <Chip
                                key={tech}
                                label={tech}
                                size="small"
                                sx={{
                                    bgcolor: alpha('#fff', 0.1),
                                    color: alpha('#fff', 0.75),
                                    border: `1px solid ${alpha('#fff', 0.15)}`,
                                    borderRadius: 1,
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );

    const renderFooter = (
        <Box
            component="footer"
            sx={{
                py: { xs: 5, md: 6 },
                bgcolor: 'background.default',
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Brand column */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                            <AniLogo size={28} />
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}
                            >
                                AniRadar
                            </Typography>
                        </Stack>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                lineHeight: 1.75,
                                maxWidth: 280,
                            }}
                        >
                            番剧与资讯一体化管理平台，实时聚合热点资讯，数据洞察一目了然。
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'text.disabled', display: 'block', mt: 2 }}
                        >
                            © {new Date().getFullYear()} AniRadar. All rights reserved.
                        </Typography>
                    </Grid>

                    {/* Links column */}
                    <Grid size={{ xs: 6, md: 4 }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 700,
                                letterSpacing: 1.5,
                                mb: 2,
                                display: 'block',
                            }}
                        >
                            项目链接
                        </Typography>
                        <Stack spacing={1.5}>
                            {[
                                {
                                    label: '后端项目 (Agora)',
                                    href: 'https://github.com/bruceblink/Agora',
                                },
                                {
                                    label: '前端项目 (AniRadar)',
                                    href: 'https://github.com/bruceblink/AniRadar',
                                },
                            ].map((link) => (
                                <Typography
                                    key={link.href}
                                    component="a"
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        '&:hover': { color: 'primary.main' },
                                    }}
                                >
                                    <Iconify icon="mdi:github" width={15} />
                                    {link.label}
                                </Typography>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Tech stack column */}
                    <Grid size={{ xs: 6, md: 4 }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 700,
                                letterSpacing: 1.5,
                                mb: 2,
                                display: 'block',
                            }}
                        >
                            技术栈
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {TECH_STACK.map((tech) => (
                                <Chip
                                    key={tech}
                                    label={tech}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        color: 'text.secondary',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                    }}
                                />
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {renderHeader}
            <Box component="main" sx={{ flexGrow: 1 }}>
                {renderHero}
                {renderStats}
                {renderNewsTimeline}
                {renderFeatures}
                {renderCTA}
            </Box>
            {renderFooter}
        </Box>
    );
}
