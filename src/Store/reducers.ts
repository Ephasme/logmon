import { List } from "immutable";
import moment = require("moment");
import { ILogLine } from "../LogWatcher";
import { AnyAction, IComputeOverloadingAction } from "./actions";
import { DataState, RootState } from "./states";

export const runComputeOverloadingAction = (state: RootState, action: IComputeOverloadingAction): DataState => {
    const { timespan, threshold } = action.payload;
    const { logs, data: { overloadingStatus } } = state;
    const first = logs.first(null);
    const last = logs.last(null);
    if (first && last) {
        const duration = moment(first.time).diff(last.time) / 1000;
        if (duration >= timespan) {
            const hits = logs.size;
            const hitsPerSeconds = hits / duration;
            const commonState = {
                currentHitsPerSeconds: hitsPerSeconds,
                timespan,
            };
            if (hitsPerSeconds > threshold) {
                return {
                    message: { type: "alert", hits: hitsPerSeconds, time: first.time },
                    overloadingStatus: "TRIGGERED",
                    ...commonState,
                };
            } else if (overloadingStatus === "TRIGGERED") {
                return {
                    message: { type: "recover", time: last.time },
                    overloadingStatus: "IDLE",
                    ...commonState,
                };
            } else {
                return {
                    message: null,
                    overloadingStatus: "IDLE",
                    ...commonState,
                };
            }
        }
    }
    return state.data;
};

export const runTrimLogs = (state: List<ILogLine>, now: Date, ttl: number) => {
    return state
        .takeWhile((x) => {
            return moment.duration(moment(now).diff(x.time)).seconds() <= ttl;
        });
};

export const runNewLog = (state: List<ILogLine>, log: ILogLine) => {
    return state.unshift(log);
};

export const dataReducer = (state: RootState, action: AnyAction): DataState => {
    switch (action.type) {
        case "COMPUTE_OVERLOADING": {
            return runComputeOverloadingAction(state, action);
        }
    }
    return state.data;
};

export const logsReducer = (state: List<ILogLine>, action: AnyAction): List<ILogLine> => {
    switch (action.type) {
        case "NEW_LOG": {
            const { log } = action.payload;
            return runNewLog(state, log);
        }
        case "TRIM_LOGS": {
            const { now, ttl } = action.payload;
            return runTrimLogs(state, now, ttl);
        }
    }
    return state;
};
