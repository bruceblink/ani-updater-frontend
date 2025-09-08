import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import useAniData from 'src/hooks/useAniData';

import { DashboardContent } from 'src/layouts/dashboard';

import { PostItem } from '../post-item';
import { PostSort } from '../post-sort';
import { PostSearch } from '../post-search';

export function BlogView() {
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
        <PostSearch
          posts={data.items}
          onInputChange={(_event, value, reason) => {
            if (reason === 'input') setSearchQuery(value);
          }}
          onSelect={(_event, value) => {
            if (value) setSearchQuery(value.title); // 点击选项时也更新搜索
          }}
        />

        <PostSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />
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
              <PostItem post={post} latestPost={latestPost} latestPostLarge={latestPostLarge} />
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