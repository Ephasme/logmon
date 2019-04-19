import { ILogLine } from "./LogWatcher";
import { List } from "immutable";
import moment = require("moment");

export function timeBoundaries(logs: List<ILogLine>): { older: ILogLine, younger: ILogLine } {
    if (logs.size === 1) {
        return { older: logs.get(0)!, younger: logs.get(0)! };
    }
    const logsWithUnix = logs.map(log => ({ log, unix: moment(log.time).unix() }));
    const older = logsWithUnix.max((log1, log2) => log1.unix - log2.unix);
    const younger = logsWithUnix.min((log1, log2) => log1.unix - log2.unix);
    if (older && younger) {
        return { older: older.log, younger: younger.log };
    }
    throw new Error("No time boundaries found.");    
}
