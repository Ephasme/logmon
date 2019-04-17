import { ILogLine } from "../Models/ILogLine";

export interface ITimerMonitor {
    onLog(log: ILogLine): void;
    run(onBatch: (batch: ILogLine[]) => void): void;
}
