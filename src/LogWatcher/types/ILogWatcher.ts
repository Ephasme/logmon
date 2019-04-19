import { ILogLine } from "./ILogLine";

export interface ILogWatcher {
    watch(onLog: (log: ILogLine) => void): void;
}
