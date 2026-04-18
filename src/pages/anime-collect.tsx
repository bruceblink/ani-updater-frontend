import { CONFIG } from 'src/config-global';

import { AnimeCollectView } from 'src/sections/anime/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`番剧收藏 - ${CONFIG.appName}`}</title>
            <AnimeCollectView />
        </>
    );
}
