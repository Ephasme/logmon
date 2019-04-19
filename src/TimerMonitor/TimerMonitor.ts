import { ILogLine, ILogWatcher } from "../LogWatcher";
import { ITimerMonitor } from "./ITimerMonitor";

export class TimerMonitor implements ITimerMonitor {
    private batch: ILogLine[] = [];
    private logWatcher: ILogWatcher;

    constructor(logWatcher: ILogWatcher) {
        this.logWatcher = logWatcher;
    }

    public watch() {
        this.logWatcher.watch((log: ILogLine) => {
            this.batch.push(log);
        });
    }

    public *flush(): IterableIterator<ILogLine> {
        const size = this.batch.length;
        let item: ILogLine | undefined;
        for (let i = 0; i < size && (item = this.batch.shift()); i++) {
            yield item;
        }
    }
}
