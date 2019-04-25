import * as moment from "moment";
import { computeTimeGap } from "../../common/computeTimeGap";
import { IAvgHitsCompute } from "../actions";
import { AvgHitsState } from "../states";

export type AvgHitsComputeRunner = (state: AvgHitsState, action: IAvgHitsCompute) => AvgHitsState;

export const runAvgHitsCompute: AvgHitsComputeRunner = (state, action) => {
    const { ttl: { ms: ttl }, now,
            elapsedSinceLastUpdate: elapsed,
            avgHitsPerSecondThreshold: threshold } = action.payload;
    const { logs: currentLogs } = state;
    let { messages, status } = state;
    const nextLogs = currentLogs.takeWhile((log) => moment(now).diff(log.time) < ttl);
    const timeGap = computeTimeGap(nextLogs, elapsed);
    const avgHitsPerSeconds = nextLogs.size / timeGap.sec;
    if (avgHitsPerSeconds > threshold && status === "idle") {
        status = "triggered";
        messages = messages.push({ type: "alert", hits: avgHitsPerSeconds, time: now });
    }
    if (avgHitsPerSeconds <= threshold && status === "triggered") {
        status = "idle";
        messages = messages.push({ type: "info", time: now });
    }
    return {
        ...state,
        messages,
        status,
        logs: nextLogs,
        avgHitsPerSeconds,
        isOverloaded: avgHitsPerSeconds > threshold,
    };
};
