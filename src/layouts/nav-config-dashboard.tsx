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
];
