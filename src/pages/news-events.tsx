import { CONFIG } from 'src/config-global';

import { NewsEventsView } from 'src/sections/news/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`热点事件 - ${CONFIG.appName}`}</title>
            <NewsEventsView />
        </>
    );
}
