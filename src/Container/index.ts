/**
 * Implemented a Pure DI pattern.
 * Better than using a full fledged DI Container.
 * Source: https://blog.ploeh.dk/2014/06/10/pure-di/
 */

import { IFileWatcher, PollingFileWatcher, readBlock } from "../FileSystem";
import { ILogWatcher, LogWatcher } from "../LogWatcher";
import { createFrom as logLineFactory } from "../Models/LogLineFactory";
import { ITailWatcher, TailWatcher } from "../TailWatcher";
import { nodeFs as fs } from "./nodeFs";
import { ITimerMonitor, TimerMonitor } from "../TimerMonitor";

export interface IKernel {
    createLogWatcher: (filename: string) => ILogWatcher;
    createTimerMonitor: (duration: number) => ITimerMonitor;
}

export const kernel: IKernel = {
    createLogWatcher(filename) {
        const fileWatcher: IFileWatcher = new PollingFileWatcher(fs, filename, 1000);
        const tailWatcher: ITailWatcher = new TailWatcher(fileWatcher, readBlock);
        return new LogWatcher(logLineFactory, tailWatcher);
    },
    createTimerMonitor(duration) {
        return new TimerMonitor(duration);
    }
};
