import { CONFIG } from 'src/config-global';

import { NewsView } from 'src/sections/news/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`News - ${CONFIG.appName}`}</title>

            <NewsView />
        </>
    );
}
