import { List } from "immutable";
import moment = require("moment");
import { ILogLine } from "../../LogWatcher";
import { IComputeOverloadingAction, UPDATE_LOAD } from "./actions";
import { LoadState } from "./states";
import { NEW_LOG, INewLogAction } from "../common/actions";
import { AnyAction } from "../actions";

export const computeTimeGap = (logs: List<ILogLine>, nullValue: number): number => {
    const first = logs.first(null);
    const last = logs.last(null);
    if (first && last) {
        const gap = moment(first.time).diff(last.time) / 1000;
        return gap;
    }
    return nullValue;
}

export const runComputeOverloadingAction = (state: LoadState, action: IComputeOverloadingAction): LoadState => {
    const { logs } = state;
    let { overloadDuration, status, message } = state;
    const { now, hitsPerSecondThreshold, maxOverloadDuration, elapsedSinceLastUpdate } = action.payload;

    const timeGap = computeTimeGap(logs, elapsedSinceLastUpdate);
    const currentHitsPerSecond = logs.size / timeGap;

    if (currentHitsPerSecond <= hitsPerSecondThreshold) {
        overloadDuration = Math.max(0, overloadDuration - timeGap);
    } else {
        overloadDuration = Math.min(maxOverloadDuration, overloadDuration + timeGap);
    }

    if (overloadDuration === maxOverloadDuration && status !== "TRIGGERED") {
        status = "TRIGGERED";
        message = { type: "alert", hits: currentHitsPerSecond, time: now };
    }

    if (overloadDuration === 0) {
        if (state.status === "TRIGGERED") {
            message = { type: "info", time: now };
        }
        status = "IDLE";
    }
    return {
        logs: List(),
        message,
        overloadDuration,
        status,
    };
};


export const runNewLogAction = (state: LoadState, action: INewLogAction): LoadState => {
    return {
        ...state,
        logs: state.logs.unshift(action.payload.log),
    }
}

export const alertReducer = (state: LoadState, action: AnyAction): LoadState => {
    switch (action.type) {
        case UPDATE_LOAD: {
            return runComputeOverloadingAction(state, action);
        }
        case NEW_LOG: {
            return runNewLogAction(state, action);
        }
    }
    return state;
};
