import { CONFIG } from 'src/config-global';

import { AnimeView } from 'src/sections/anime/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`Animes - ${CONFIG.appName}`}</title>
            <AnimeView />
        </>
    );
}
