import { ILogLine } from "../../LogWatcher";
import { INewLogAction, NEW_LOG } from "../common/actions";

export const START_ANALYSIS = "analysis/START_ANALYSIS";
export interface IStartAnalysis {
    type: typeof START_ANALYSIS;
    payload: { };
}

export type AnyAlertAction =
    | INewLogAction
    | IStartAnalysis;

export const newLogAction = (log: ILogLine): INewLogAction =>
    ({ type: NEW_LOG, payload: { log }});

export const startAnalysis = (): IStartAnalysis =>
    ({ type: START_ANALYSIS, payload: { }});