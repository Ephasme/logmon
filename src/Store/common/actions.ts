import { ILogLine } from "../../LogWatcher";

export const NEW_LOG = "common/NEW_LOG";
export interface INewLogAction {
    type: typeof NEW_LOG;
    payload: {
        log: ILogLine,
    };
}

export const newLog = (log: ILogLine): INewLogAction =>
    ({ type: NEW_LOG, payload: { log }});
