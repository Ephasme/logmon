import { ILogLine } from "../../LogWatcher";

export const NEW_LOG = "common/NEW_LOG";
export interface INewLogAction {
    type: typeof NEW_LOG;
    payload: {
        log: ILogLine,
    };
}