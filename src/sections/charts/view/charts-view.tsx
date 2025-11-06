import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import ChartsItem from '../charts';


export function ChartsView() {

    return (
        <DashboardContent>

            <Typography variant="h4" sx={{ mb: 5 }}>
                Charts
            </Typography>
            <ChartsItem/>
        </DashboardContent>
    );
}
