import { ILogLine } from "../LogWatcher";

export const NEW_LOG = "NEW_LOG";
export interface INewLogAction {
    type: typeof NEW_LOG;
    payload: {
        log: ILogLine,
    };
}

export const COMPUTE_OVERLOADING = "COMPUTE_OVERLOADING";
export interface IComputeOverloadingAction {
    type: typeof COMPUTE_OVERLOADING;
    payload: {
        now: Date;
        // The maximum value of hits per seconds over which the application is overloaded.
        hitsPerSecondsThreshold: number;
    };
}

export type AnyAction =
    | INewLogAction
    | IComputeOverloadingAction;

export const newLogAction = (log: ILogLine): INewLogAction =>
    ({ type: NEW_LOG, payload: { log }});

export const computeOverloadingAction = (hitsPerSecondsThreshold: number, now: Date): IComputeOverloadingAction =>
    ({ type: COMPUTE_OVERLOADING, payload: { now, hitsPerSecondsThreshold }});
