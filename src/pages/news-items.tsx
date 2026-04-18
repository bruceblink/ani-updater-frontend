import { CONFIG } from 'src/config-global';

import { NewsItemsView } from 'src/sections/news/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`新闻条目 - ${CONFIG.appName}`}</title>
            <NewsItemsView />
        </>
    );
}
