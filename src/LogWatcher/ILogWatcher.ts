import { ILogLine } from "../Models/ILogLine";

export type Handler = (log: ILogLine) => void;

export interface ILogWatcher {
    subscribe(onLog: Handler): void;
    watch(): void;
}
