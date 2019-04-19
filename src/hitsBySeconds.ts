import { ILogLine } from "./LogWatcher";
import { List } from "immutable";
import { timeBoundaries } from "./timeBoudaries";
import moment = require("moment");

export function hitsBySeconds(logs: ILogLine[]) {
    if (logs.length === 0) return 0;
    if (logs.length === 1) return 1;
    const result = timeBoundaries(List(logs));
    const ms = moment(result.older.time).diff(result.younger.time, "s");
    return (logs.length / ms);
}
