import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
    title: string;
    path: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
};

export const navData =  [
    {
        title: '数据总览',
        path: '/',
        icon: icon('ic-analytics'),
    },
    {
        title: '番剧列表',
        path: '/animes',
        icon: icon('ic-blog'),
    },
    {
        title: '图表分析',
        path: '/charts',
        icon: icon('ic-blog'),
    },
    {
        title: '定时任务',
        path: '/scheduledTasks',
        icon: icon('ic-blog'),
        info: null,
    },
    {
        title: '番剧收藏',
        path: '/anime-collect',
        icon: icon('ic-blog'),
    },
    {
        title: '新闻条目',
        path: '/news-items',
        icon: icon('ic-blog'),
    },
    {
        title: '热点事件',
        path: '/news-events',
        icon: icon('ic-blog'),
    },
];
