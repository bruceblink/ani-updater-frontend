import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { FormGroup } from '@mui/material';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export type FiltersProps = {
    platform: string[];
    episode: string;
    //rating: string;
};

export type AnimeFiltersProps = {
    canReset: boolean;
    openFilter: boolean;
    filters: FiltersProps;
    onOpenFilter: () => void;
    onCloseFilter: () => void;
    onResetFilter: () => void;
    onSetFilters: (updateState: Partial<FiltersProps>) => void;
    options: {
        //ratings: string[];
        platforms: { value: string; label: string }[];
        episodes: { value: string; label: string }[];
    };
};

export function AnimeFilters({
    filters,
    options,
    canReset,
    openFilter,
    onSetFilters,
    onOpenFilter,
    onCloseFilter,
    onResetFilter,
}: AnimeFiltersProps) {
    const renderPlatform = (
        <Stack spacing={1}>
            <Typography variant="subtitle2">Platform</Typography>
            <FormGroup>
                {options.platforms.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        control={
                            <Checkbox
                                checked={filters.platform.includes(option.value)}
                                onChange={() => {
                                    const checked = filters.platform.includes(option.value)
                                        ? filters.platform.filter((value) => value !== option.value)
                                        : [...filters.platform, option.value];

                                    onSetFilters({ platform: checked });
                                }}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </FormGroup>
        </Stack>
    );

    const renderEpisode = (
        <Stack spacing={1}>
            <Typography variant="subtitle2">Episode</Typography>
            <RadioGroup>
                {options.episodes.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={
                            <Radio
                                checked={filters.episode.includes(option.value)}
                                onChange={() => onSetFilters({ episode: option.value })}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </RadioGroup>
        </Stack>
    );

    return (
        <>
            <Button
                disableRipple
                color="inherit"
                endIcon={
                    <Badge color="error" variant="dot" invisible={!canReset}>
                        <Iconify icon="ic:round-filter-list" />
                    </Badge>
                }
                onClick={onOpenFilter}
            >
                Filters
            </Button>

            <Drawer
                anchor="right"
                open={openFilter}
                onClose={onCloseFilter}
                slotProps={{
                    paper: {
                        sx: { width: 280, overflow: 'hidden' },
                    },
                }}
            >
                <Box
                    sx={{
                        py: 2,
                        pl: 2.5,
                        pr: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Filters
                    </Typography>

                    <IconButton onClick={onResetFilter}>
                        <Badge color="error" variant="dot" invisible={!canReset}>
                            <Iconify icon="solar:restart-bold" />
                        </Badge>
                    </IconButton>

                    <IconButton onClick={onCloseFilter}>
                        <Iconify icon="mingcute:close-line" />
                    </IconButton>
                </Box>

                <Divider />

                <Scrollbar>
                    <Stack spacing={3} sx={{ p: 3 }}>
                        {renderPlatform}
                        {renderEpisode}
                    </Stack>
                </Scrollbar>
            </Drawer>
        </>
    );
}
