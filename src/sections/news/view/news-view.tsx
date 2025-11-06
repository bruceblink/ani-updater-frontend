import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import NewsItem from '../news-charts';


export function NewsView() {

    return (
        <DashboardContent>

            <Typography variant="h4" sx={{ mb: 5 }}>
                News
            </Typography>
            <NewsItem/>
        </DashboardContent>
    );
}
