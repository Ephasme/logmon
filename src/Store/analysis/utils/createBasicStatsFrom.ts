import { List } from "immutable";
import { ILogLine } from "../../../LogWatcher";
import { computeTimeGap } from "../../common/computeTimeGap";
import { Seconds, Sec } from "../../../Utils/units";

export interface IBasicStats {
    readonly hits: number,
    readonly traffic: number,
    readonly errors: number,
    readonly timespan: Seconds,
}

export const defaultBasicStatsFactory: () => IBasicStats = () => ({
    hits: 0,
    traffic: 0,
    errors: 0,
    timespan: Sec(0),
});

export const createBasicStatsFrom: (logs: List<ILogLine>) => IBasicStats = (logs) => {
    const stats = {
        traffic: 0,
        errors: 0,
    }
    for (const log of logs) {
        stats.errors += log.result >= 200 && log.result <= 299 ? 0 : 1;
        stats.traffic += log.packet;
    }
    return {
        ...stats,
        hits: logs.size,
        timespan: computeTimeGap(logs, Sec(Infinity)),
    };
};