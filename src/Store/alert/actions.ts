import { ILogLine } from "../../LogWatcher";
import { INewLogAction, NEW_LOG } from "../common/actions";

export const COMPUTE_OVERLOADING = "alert/COMPUTE_OVERLOADING";
export interface IComputeOverloadingAction {
    type: typeof COMPUTE_OVERLOADING;
    payload: {
        now: Date;
        hitsPerSecondsThreshold: number;
    };
}

export type AnyAlertAction =
    | INewLogAction
    | IComputeOverloadingAction;

export const newLog = (log: ILogLine): INewLogAction =>
    ({ type: NEW_LOG, payload: { log }});

export const computeOverloading = (hitsPerSecondsThreshold: number, now: Date): IComputeOverloadingAction =>
    ({ type: COMPUTE_OVERLOADING, payload: { now, hitsPerSecondsThreshold }});
