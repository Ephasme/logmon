import { List } from "immutable";

import { generateLogLine } from "./logLineFactory";

export const makeLogs = () => {
    const last = 50;
    const first = 58;
    const logs = List([
        generateLogLine({ time: new Date(2015, 1, 2, 1, 12, first) }),
        generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 56) }),
        generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 55) }),
        generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 51) }),
        generateLogLine({ time: new Date(2015, 1, 2, 1, 12, last) }),
    ]);
    const elapsed = first - last;
    return {
        logs: logs,
        elapsed,
        hitsPerSecond: logs.size / elapsed,
    }
};