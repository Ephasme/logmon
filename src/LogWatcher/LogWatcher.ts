import { ILogLine, ILogWatcher } from ".";
import { ITailWatcher } from "../TailWatcher";
import { FactoryFunction } from "./LogLineFactory";

export class LogWatcher implements ILogWatcher {

    private watcher: ITailWatcher;
    private factory: FactoryFunction;

    constructor(factory: FactoryFunction, watcher: ITailWatcher) {
        this.watcher = watcher;
        this.factory = factory;
    }

    public watch(onLog: (log: ILogLine) => void): void {
        this.watcher.watch((block) => {
            const log = this.factory(block);
            if (log) {
                onLog(log);
            }
        });
    }
}
