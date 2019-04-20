import { ILogLine } from "../LogWatcher";

export const NEW_LOG = "NEW_LOG";
export interface INewLogAction {
    type: typeof NEW_LOG;
    payload: {
        log: ILogLine,
    };
}

export const TRIM_LOGS = "TRIM_LOGS";
export interface ITrimLogAction {
    type: typeof TRIM_LOGS;
    payload: {
        now: Date,
        ttl: number,
    };
}

export const COMPUTE_OVERLOADING = "COMPUTE_OVERLOADING";
export interface IComputeOverloadingAction {
    type: typeof COMPUTE_OVERLOADING;
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
    ({ type: NEW_LOG, payload: { log }});

export const trimLogsAction = (now: Date, ttl: number): ITrimLogAction =>
    ({ type: TRIM_LOGS, payload: { now, ttl }});

export const computeOverloadingAction = (timespan: number, threshold: number): IComputeOverloadingAction =>
    ({ type: COMPUTE_OVERLOADING, payload: { timespan, threshold }});
