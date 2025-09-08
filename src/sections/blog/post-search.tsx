import type { Ani } from 'src/hooks/useAniData';
import type { Theme, SxProps } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

type PostSearchProps = {
  posts: Ani[];
  sx?: SxProps<Theme>;
  onInputChange?: (_event: React.SyntheticEvent, value: string) => void;
};

export function PostSearch({ posts, onInputChange }: PostSearchProps) {
  return (
    <Autocomplete
      sx={{ width: 280 }}
      autoHighlight
      popupIcon={null}
      options={posts}
      getOptionLabel={(post) => post.title}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onInputChange={onInputChange} // 🔹 绑定回调
      filterOptions={(options, state) =>
        options.filter((post) => post.title.toLowerCase().includes(state.inputValue.toLowerCase()))
      } // 本地过滤
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search ani..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}