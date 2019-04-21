import { List } from "immutable";
import { ILogLine } from "../../../LogWatcher";
import { computeTimeGap } from "../../common/computeTimeGap";

export interface IBasicStats {
    readonly hits: number,
    readonly traffic: number,
    readonly errors: number,
}

export const defaultBasicStatsFactory = () => ({
    hits: 0,
    traffic: 0,
    errors: 0,
    timespan: 0,
});

export const createBasicStatsFrom: (logs: List<ILogLine>) => IBasicStats = (logs) => {
    const stats = {
        hits: 0,
        traffic: 0,
        errors: 0,
    }
    for (const log of logs) {
        stats.hits++;
        stats.errors += log.result >= 200 && log.result <= 299 ? 0 : 1;
        stats.traffic += log.packet;
    }
    return {
        ...stats,
        timespan: computeTimeGap(logs, 0),
    };
};