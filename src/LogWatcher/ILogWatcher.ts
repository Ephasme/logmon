import { ILogLine } from "../Models/ILogLine";

export interface IHandler {
    onLog: HandlerDelegate;
}
export type HandlerDelegate = (log: ILogLine) => void;
export type AnyListener = HandlerDelegate | IHandler;

export interface ILogWatcher {
    subscribe(input: AnyListener): void;
    watch(): void;
}
