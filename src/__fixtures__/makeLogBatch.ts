import { List } from "immutable";

import { generateLogLine } from "./logLineFactory";

export const makeLogs = () => List([
    generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 58) }),
    generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 56) }),
    generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 55) }),
    generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 51) }),
    generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 50) }),
]);