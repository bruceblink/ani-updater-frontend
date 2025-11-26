import { CONFIG } from 'src/config-global';

import { NotAccessView } from '../sections/error/not-access-view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`403 page not access! | Error - ${CONFIG.appName}`}</title>

            <NotAccessView />
        </>
    );
}
