import { ILogLine } from "../../LogWatcher";

export const NEW_LOG = "global/NEW_LOG";

export interface INewLog {
    type: typeof NEW_LOG;
    payload: {
        log: ILogLine,
    };
}

export const newLog = (log: ILogLine): INewLog => ({
    type: NEW_LOG,
    payload: { log },
});
