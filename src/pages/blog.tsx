import useAniData from 'src/hooks/useAniData';

import { CONFIG } from 'src/config-global';

import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function Page() {

  const { data } = useAniData();

  return (
    <>
      <title>{`Anis - ${CONFIG.appName}`}</title>
      <BlogView posts={data} />
    </>
  );
}
