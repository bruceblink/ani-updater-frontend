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
        title: 'Dashboard',
        path: '/',
        icon: icon('ic-analytics'),
    },
    {
        title: 'Anime',
        path: '/animes',
        icon: icon('ic-blog'),
    },
    {
        title: 'Charts',
        path: '/charts',
        icon: icon('ic-blog'),
    },
    {
        title: 'ScheduledTasks',
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
