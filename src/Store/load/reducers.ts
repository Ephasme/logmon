import { List } from "immutable";
import { IComputeOverloadingAction, UPDATE_LOAD } from "./actions";
import { LoadState } from "./states";
import { NEW_LOG, INewLogAction } from "../common/actions";
import { AnyAction } from "../actions";
import { computeTimeGap } from "../common/computeTimeGap";
import { Sec } from "../../Utils/units";

export const runComputeOverloadingAction = (state: LoadState, action: IComputeOverloadingAction): LoadState => {
    const { logs } = state;
    let { overloadDuration, status, message } = state;
    const { now, hitsPerSecondThreshold, maxOverloadDuration, elapsedSinceLastUpdate } = action.payload;

    const timeGap = computeTimeGap(logs, elapsedSinceLastUpdate.sec);
    const currentHitsPerSecond = logs.size / timeGap;

    if (currentHitsPerSecond <= hitsPerSecondThreshold) {
        overloadDuration = Sec(Math.max(0, overloadDuration.sec - timeGap));
    } else {
        overloadDuration = Sec(Math.min(maxOverloadDuration.sec, overloadDuration.sec + timeGap));
    }

    if (overloadDuration.sec === maxOverloadDuration.sec  && status !== "TRIGGERED") {
        status = "TRIGGERED";
        message = { type: "alert", hits: currentHitsPerSecond, time: now };
    }

    if (overloadDuration.sec === 0) {
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
