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

export const newLogAction = (log: ILogLine): INewLogAction =>
    ({ type: "NEW_LOG", payload: { log }});

export const trimLogsAction = (now: Date, ttl: number): ITrimLogAction =>
    ({ type: "TRIM_LOGS", payload: { now, ttl }});

export const computeOverloadingAction = (timespan: number, threshold: number): IComputeOverloadingAction =>
    ({ type: "COMPUTE_OVERLOADING", payload: { timespan, threshold }});
