import { ILogLine } from "../Models/ILogLine";

export interface ILogRepository {
    add(logLine: ILogLine): void;
    fetchByTime(after: Date): IterableIterator<ILogLine>;
}

class LogRepository implements ILogRepository {
    private timeseries: ILogLine[] = [];

    public add(logLine: ILogLine): void {
        this.timeseries.push(logLine);
    }

    public *fetchByTime(after: Date): IterableIterator<ILogLine> {
        for (const logLine of this.timeseries) {
            if (logLine.time > after) {
                yield logLine;
            }
        }
    }
}

let repo: ILogRepository = null;

export function factory() {
    if (repo == null) {
        repo = new LogRepository();
    }
    return repo;
}
