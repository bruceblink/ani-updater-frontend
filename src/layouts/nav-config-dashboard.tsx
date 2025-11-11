import { SvgColor } from 'src/components/svg-color';

import { Label } from '../components/label';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
    title: string;
    path: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
};

export const getNavData = (count: number): NavItem[] => [
    {
        title: 'Dashboard',
        path: '/',
        icon: icon('ic-analytics'),
    },
    {
        title: 'Anime',
        path: '/animes',
        icon: icon('ic-blog'),
        info:
            count > 0 ? (
                <Label color="error" variant="inverted">
                    +{count}
                </Label>
            ) : null,
    },
    {
        title: 'Charts',
        path: '/charts',
        icon: icon('ic-blog'),
    },
    {
        title: 'News',
        path: '/news',
        icon: icon('ic-blog'),
        info: null,
    },
];
