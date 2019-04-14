import { ILogLine } from "../Models/ILogLine";
import * as LogLineFactory from "../Models/LogLineFactory";
import { ITailWatcher } from "../TailWatcher/ITailWatcher";
import { Handler, ILogWatcher } from "./ILogWatcher";

export class LogWatcher implements ILogWatcher {

    private subs: Handler[] = [];
    private watcher: ITailWatcher;

    constructor(watcher: ITailWatcher) {
        this.watcher = watcher;
    }

    public subscribe(onLog: Handler): void {
        this.subs.push(onLog);
    }

    public watch(): void {
        this.watcher.watch((block) => {
            const log = LogLineFactory.createFrom(block);
            if (log) {
                this.onLog(log);
            }
        });
    }

    private onLog(logLine: ILogLine): void {
        for (const sub of this.subs) {
            sub(logLine);
        }
    }
}
