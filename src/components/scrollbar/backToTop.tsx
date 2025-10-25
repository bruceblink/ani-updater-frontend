import React from 'react';

import { Box, Fab, Zoom, useScrollTrigger } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ScrollTop(props: { window?: () => Window; children: React.ReactElement }) {
    const { window: windowFunc, children } = props;

    const trigger = useScrollTrigger({
        target: windowFunc ? windowFunc() : undefined,
        disableHysteresis: true,
        threshold: 200,
    });

    const handleClick = () => {
        const targetWindow = windowFunc
            ? windowFunc()
            : typeof window !== 'undefined'
              ? window
              : undefined;
        if (targetWindow) {
            targetWindow.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <Zoom in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{ position: 'fixed', bottom: 60, right: 25, zIndex: 1300 }}
            >
                {children}
            </Box>
        </Zoom>
    );
}

export function BackToTop(props: { window?: () => Window }) {
    return (
        <ScrollTop {...props}>
            <Fab color="primary" size="small" aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
            </Fab>
        </ScrollTop>
    );
}
