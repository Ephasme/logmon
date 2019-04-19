import { ILogLine } from "../LogWatcher";

export interface ITimerMonitor {
    flush(): IterableIterator<ILogLine>;
    watch(): void;
}
