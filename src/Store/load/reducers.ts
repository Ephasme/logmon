import { List } from "immutable";
import { Sec } from "../../Utils/units";
import { AnyAction } from "../actions";
import { INewLog, NEW_LOG } from "../common/actions";
import { computeTimeGap } from "../common/computeTimeGap";
import { IComputeOverloading, UPDATE_LOAD } from "./actions";
import { LoadState } from "./states";

export const runComputeOverloadingAction = (state: LoadState, action: IComputeOverloading): LoadState => {
    const { logs } = state;
    let { overloadDuration, status, messages } = state;
    const { now, hitsPerSecondThreshold, maxOverloadDuration, elapsedSinceLastUpdate } = action.payload;

    const timeGap = computeTimeGap(logs, elapsedSinceLastUpdate);
    const currentHitsPerSecond = logs.size / timeGap.sec;

    if (currentHitsPerSecond <= hitsPerSecondThreshold) {
        overloadDuration = Sec(Math.max(0, overloadDuration.sec - timeGap.sec));
    } else {
        overloadDuration = Sec(Math.min(maxOverloadDuration.sec, overloadDuration.sec + timeGap.sec));
    }

    if (overloadDuration.sec === maxOverloadDuration.sec  && status !== "TRIGGERED") {
        status = "TRIGGERED";
        messages = messages.unshift({ type: "alert", hits: currentHitsPerSecond, time: now });
    }

    if (overloadDuration.sec === 0) {
        if (state.status === "TRIGGERED") {
            messages = messages.unshift({ type: "info", time: now });
        }
        status = "IDLE";
    }
    return {
        logs: List(),
        messages,
        overloadDuration,
        status,
    };
};

export const runNewLogAction = (state: LoadState, action: INewLog): LoadState => {
    return {
        ...state,
        logs: state.logs.unshift(action.payload.log),
    };
};

export type LoadReducer = (state: LoadState, action: AnyAction) => LoadState;

export const loadReducer: LoadReducer = (state, action) => {
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
