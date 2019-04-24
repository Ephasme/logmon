import { List } from "immutable";
import { ILogLine } from "../../../LogWatcher";
import { ISeconds, Sec } from "../../../Utils/units";
import { computeTimeGap } from "../../common/computeTimeGap";

export interface IBasicStats {
    readonly hits: number;
    readonly traffic: number;
    readonly errors: number;
    readonly timespan: ISeconds;
}

export const defaultBasicStatsFactory: () => IBasicStats = () => ({
    hits: 0,
    traffic: 0,
    errors: 0,
    timespan: Sec(0),
});

export type CreateBasicStatsFrom = (logs: List<ILogLine>) => IBasicStats;

export const createBasicStatsFrom: CreateBasicStatsFrom = (logs) => {
    const stats = {
        traffic: 0,
        errors: 0,
    };
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
