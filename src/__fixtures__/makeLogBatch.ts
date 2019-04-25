import { List } from "immutable";

import { generateLogLine } from "./logLineFactory";

export const makeLogs = () => {
    const expired = [
        generateLogLine({ time: new Date(2018, 0, 0, 0, 0, 1, 0) }), // EXPIRED
        generateLogLine({ time: new Date(2018, 0, 0, 0, 0, 5, 0) }), // EXPIRED
        generateLogLine({ time: new Date(2018, 0, 0, 0, 0, 6, 0) }), // EXPIRED
        generateLogLine({ time: new Date(2018, 0, 0, 0, 0, 8, 0) }), // EXPIRED
    ];
    const valid = [
        generateLogLine({ time: new Date(2018, 0, 0, 0, 0, 9, 0) }), // OK
        generateLogLine({ time: new Date(2018, 0, 0, 0, 0, 9, 0) }), // OK
        generateLogLine({ time: new Date(2018, 0, 0, 0, 0, 10, 0) }), // OK
        generateLogLine({ time: new Date(2018, 0, 0, 0, 0, 12, 0) }), // OK
    ];
    const logs = List([
        ...expired,
        ...valid,
    ].reverse());
    const elapsed = valid[3].time.getSeconds() - valid[0].time.getSeconds();
    return {
        logs,
        timeGap: elapsed,
        elapsed,
        hitsPerSecond: valid.length / elapsed,
    };
};
