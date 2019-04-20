import { List } from "immutable";
import moment = require("moment");
import { ILogLine } from "../../LogWatcher";
import { AnyAlertAction, IComputeOverloadingAction, COMPUTE_OVERLOADING, NEW_LOG, INewLogAction } from "./actions";
import { AlertState, OVERLOADING, RECOVERING } from "./states";

export const computeTimeGap = (logs: List<ILogLine>): number | null => {
    const first = logs.first(null);
    const last = logs.last(null);
    if (first && last) {
        const gap = moment(first.time).diff(last.time) / 1000;
        return gap;
    }
    return null;
}

export const runComputeOverloadingAction = (state: AlertState, action: IComputeOverloadingAction): AlertState => {
    const { now, hitsPerSecondsThreshold } = action.payload;
    const { logs, status } = state;

    const gap = computeTimeGap(logs);
    
    const hitsPerSeconds = logs.size / (gap || Infinity);

    if (hitsPerSeconds >= hitsPerSecondsThreshold) {
        if (status.type !== OVERLOADING) {
            return {
                logs: List<ILogLine>(),
                status: { type: OVERLOADING, since: now, hits: hitsPerSeconds },
            };
        }
    } else {
        if (status.type === OVERLOADING) {
            return {
                logs: List<ILogLine>(),
                status: { type: RECOVERING, since: now },
            };
        }
    }
    return { ...state, logs: List() };
};


export const runNewLogAction = (state: AlertState, action: INewLogAction): AlertState => {
    return {
        ...state,
        logs: state.logs.unshift(action.payload.log),
    }
}

export const alertReducer = (state: AlertState, action: AnyAlertAction): AlertState => {
    switch (action.type) {
        case COMPUTE_OVERLOADING: {
            return runComputeOverloadingAction(state, action);
        }
        case NEW_LOG: {
            return runNewLogAction(state, action);
        }
    }
    return state;
};
