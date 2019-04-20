import { ILogLine } from "../LogWatcher";

export interface INewLogAction {
    type: "NEW_LOG";
    payload: {
        log: ILogLine,
    };
}

export interface ITrimLogAction {
    type: "TRIM_LOGS";
    payload: {
        now: Date,
        ttl: number,
    };
}

export interface IComputeOverloadingAction {
    type: "COMPUTE_OVERLOADING";
    payload: {
        threshold: number;
        timespan: number;
    };
}

export type AnyAction =
    | INewLogAction
    | ITrimLogAction
    | IComputeOverloadingAction;