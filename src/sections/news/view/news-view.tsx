import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _posts, _products } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { NewsCard } from '../news-card';


export function NewsView() {

    return (
        <DashboardContent>

            <Typography variant="h4" sx={{ mb: 5 }}>
                News
            </Typography>

            <Grid container spacing={3}>
                {_products.map((product) => (
                    <Grid key={product.id} size={{ xs: 12, sm: 8, md: 6, lg: 4 }}>
                        <NewsCard title={product.name} list={_posts.slice(0, 5)} />
                    </Grid>
                ))}
            </Grid>
        </DashboardContent>
    );
}
