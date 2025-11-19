import { CONFIG } from 'src/config-global';

import { ScheduledTaskView } from 'src/sections/scheduled-task/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`ScheduledTask - ${CONFIG.appName}`}</title>

            <ScheduledTaskView />
        </>
    );
}
