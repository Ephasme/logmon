import moment = require("moment");
import { AnyAction } from "../actions";
import { NEW_LOG } from "../common/actions";
import { computeTimeGap } from "../common/computeTimeGap";
import { AVGHITS_COMPUTE, IAvgHitsCompute } from "./actions";
import { AvgHitsState } from "./states";

export type AvgHitsComputeAction = (state: AvgHitsState, action: IAvgHitsCompute) => AvgHitsState;

export const runAvgHitsCompute: AvgHitsComputeAction = (state, action) => {
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

export type AvgHitsStateReducer = (state: AvgHitsState, action: AnyAction) => AvgHitsState;

export const avgHitsReducer: AvgHitsStateReducer = (state, action) => {
    switch (action.type) {
        case NEW_LOG: {
            return {...state, logs: state.logs.unshift(action.payload.log) };
        }
        case AVGHITS_COMPUTE: {
            return runAvgHitsCompute(state, action);
        }
    }
    return state;
};
