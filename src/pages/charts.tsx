import { CONFIG } from 'src/config-global';

import { ChartsView } from 'src/sections/charts/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`News - ${CONFIG.appName}`}</title>

            <ChartsView />
        </>
    );
}
