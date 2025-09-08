import { CONFIG } from 'src/config-global';

import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function Page() {

  return (
    <>
      <title>{`Anis - ${CONFIG.appName}`}</title>
      <BlogView />
    </>
  );
}
