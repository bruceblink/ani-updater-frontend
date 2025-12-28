import Grid from '@mui/material/Grid';

import { CONFIG } from 'src/config-global';

import { _posts } from '../_mock';
import { AnalyticsNews } from '../sections/overview/analytics-news';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`News-Analytics - ${CONFIG.appName}`}</title>

            <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                <AnalyticsNews title="News Analytics" list={_posts.slice(0, 5)} />
            </Grid>
        </>
    );
}
