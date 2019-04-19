import { ILogLine } from "../Models/ILogLine";
import { FactoryFunction } from "../Models/LogLineFactory";
import { ITailWatcher } from "../TailWatcher/ITailWatcher";
import { AnyListener, HandlerDelegate, ILogWatcher } from "./ILogWatcher";

export class LogWatcher implements ILogWatcher {

    private subs: HandlerDelegate[] = [];
    private watcher: ITailWatcher;
    private factory: FactoryFunction;

    constructor(factory: FactoryFunction, watcher: ITailWatcher) {
        this.watcher = watcher;
        this.factory = factory;
    }

    public subscribe(input: AnyListener): void {
        if (typeof input === "function") {
            this.subs.push(input);
        } else {
            this.subs.push((log) => input.onLog(log));
        }
    }

    public watch(): void {
        this.watcher.watch((block) => {
            const log = this.factory(block);
            if (log) {
                this.handle(log);
            }
        });
    }

    private handle(logLine: ILogLine): void {
        for (const sub of this.subs) {
            sub(logLine);
        }
    }
}
