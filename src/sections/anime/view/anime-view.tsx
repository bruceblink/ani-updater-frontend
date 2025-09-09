import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import useAniData from 'src/hooks/useAniData';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnimeItem } from '../anime-item';
import { AnimeSort } from '../anime-sort';
import { AnimeSearch } from '../anime-search';
import { AnimeFilters } from '../anime-filters';

import type { FiltersProps } from '../anime-filters';


const PLATFORM_OPTIONS = [
  { value: 'agedm', label: 'Agedm' },
  { value: 'bilibili', label: 'Bilibili' },
  { value: 'iqiyi', label: 'Iqiyi' },
  { value: 'tencent', label: 'Tencent' },
  { value: 'youku', label: 'Youku' },
];

/*const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];*/

const EPISODE_OPTIONS = [
  { value: 'below', label: 'Below 25' },
  { value: 'between', label: 'Between 25 - 75' },
  { value: 'above', label: 'Above 75' },
];

const defaultFilters = {
  episode: '',
  platform: [PLATFORM_OPTIONS[0].value],
};


export function AnimeView() {
  const [page, setPage] = useState(1);  // 当前页码，默认 1
  const query = useMemo(() => ({ page, page_size: 20 }), [page]);
  const { data, loading, error } = useAniData(query); // 传给 hook
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); // 更新页码
  };

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  // 本地搜索过滤
  const filteredPosts = useMemo(
    () => items.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [items, searchQuery]
  );

  // 本地排序
  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts];
    if (sortBy === 'latest') return sorted.sort((a, b) => b.update_time - a.update_time);
    if (sortBy === 'oldest') return sorted.sort((a, b) => a.update_time - b.update_time);
    if (sortBy === 'popular') {
      // 按 update_count 数量排序，如果是字符串数字需要 parseInt
      return sorted.sort((a, b) => parseInt(b.update_count) - parseInt(a.update_count));
    }
    return sorted;
  }, [filteredPosts, sortBy]);


  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);


  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  );

  if (loading)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        查询出错了: {error}
      </Box>
    );
  if (!data)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        没有数据
      </Box>
    );

  // -------------------

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          今日动漫更新
        </Typography>
      </Box>

      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* 本地搜索 */}
        <AnimeSearch
          posts={data.items}
          onInputChange={(_event, value, reason) => {
            if (reason === 'input') setSearchQuery(value);
          }}
          onSelect={(_event, value) => {
            if (value) setSearchQuery(value.title); // 点击选项时也更新搜索
          }}
        />
        <Box
          sx={{
            my: 1,
            gap: 1,
            flexShrink: 0,
            display: 'flex',
          }}
        >
          <AnimeFilters
            canReset={canReset}
            filters={filters}
            onSetFilters={handleSetFilters}
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onResetFilter={() => setFilters(defaultFilters)}
            options={{
              platforms: PLATFORM_OPTIONS,
              episodes: EPISODE_OPTIONS,
            }}
          />

          <AnimeSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'latest', label: 'Latest' },
              { value: 'popular', label: 'Popular' },
              { value: 'oldest', label: 'Oldest' },
            ]}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {sortedPosts.map((post, index) => {
          const latestPostLarge = index === 0;
          const latestPost = index === 1 || index === 2;

          return (
            <Grid
              key={post.id}
              size={{
                xs: 12,
                sm: latestPostLarge ? 12 : 6,
                md: latestPostLarge ? 6 : 3,
              }}
            >
              <AnimeItem post={post} latestPost={latestPost} latestPostLarge={latestPostLarge} />
            </Grid>
          );
        })}
      </Grid>

      <Pagination
        count={data.total_pages}
        page={page}
        onChange={handleChange}
        color="primary"
        sx={{ mt: 8, mx: 'auto' }}
      />
    </DashboardContent>
  );
}