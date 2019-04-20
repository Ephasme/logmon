import { ILogLine } from "../LogWatcher";
import { AnyAction } from "./actions";
import { List } from "immutable";
import moment = require("moment");
import { RootState, DataState } from "./states";

export const dataReducer = (state: RootState, action: AnyAction): DataState => {
    const { logs } = state;
    switch (action.type) {
        case "COMPUTE_OVERLOADING": {
            const { timespan, threshold } = action.payload;
            const first = logs.first(null);
            const last = logs.last(null);
            if (first && last) {
                const duration = moment(first.time).diff(last.time) / 1000;
                if (duration >= timespan) {
                    const hits = logs.size;
                    const hitsPerSeconds = hits / duration;
                    if (hitsPerSeconds > threshold) {
                        return {
                            message: { type: "alert", hits: hitsPerSeconds, time: first.time },
                            overloadingStatus: "TRIGGERED",
                            currentHitsPerSeconds: hitsPerSeconds,
                            timespan,
                        };
                    } else {
                        return {
                            message: { type: "recover", time: last.time },
                            overloadingStatus: "IDLE",
                            currentHitsPerSeconds: hitsPerSeconds,
                            timespan: duration,
                        };
                    }
                }
            }
        }
    }
    return state.data;
};

export const logsReducer = (state: List<ILogLine>, action: AnyAction): List<ILogLine> => {
    switch (action.type) {
        case "NEW_LOG": {
            const { log } = action.payload;
            return state
                .unshift(log);
        }
        case "TRIM_LOGS": {
            const { now, ttl } = action.payload;
            return state
                .takeWhile((x) => {
                    return moment.duration(moment(now).diff(x.time)).seconds() <= ttl;
                });
        }
    }
    return state;
};
