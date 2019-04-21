import moment = require("moment");
import { ILogLine, ILogWatcher } from ".";
import { ITailWatcher } from "../TailWatcher";
import { TimeProvider } from "../Time";
import { FactoryFunction } from "./LogLineFactory";

export class LogWatcher implements ILogWatcher {

    private watcher: ITailWatcher;
    private factory: FactoryFunction;
    private now: Date;

    constructor(factory: FactoryFunction, watcher: ITailWatcher, getNow: TimeProvider) {
        this.watcher = watcher;
        this.factory = factory;
        this.now = getNow();
    }

    public watch(onLog: (log: ILogLine) => void): void {
        this.watcher.watch((block) => {
            const log = this.factory(block);
            if (log && moment(log.time).isAfter(this.now)) {
                onLog(log);
            }
        });
    }
}
