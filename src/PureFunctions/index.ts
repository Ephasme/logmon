import { ILogLine } from "../Models/ILogLine";

export function *fetchByTime(logs: ILogLine[], after: Date): IterableIterator<ILogLine> {
    for (const logLine of logs) {
        if (logLine.time > after) {
            yield logLine;
        }
    }
}
