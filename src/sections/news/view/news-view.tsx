import Typography from '@mui/material/Typography';

import { _posts } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { NewsCard } from '../news-card';


export function NewsView() {

    return (
        <DashboardContent>

            <Typography variant="h4" sx={{ mb: 5 }}>
                News
            </Typography>
            <NewsCard title="NewsView" list={_posts.slice(0, 5)} />
        </DashboardContent>
    );
}
