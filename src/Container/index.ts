/**
 * Implemented a Pure DI pattern.
 * Better than using a full fledged DI Container.
 * Source: https://blog.ploeh.dk/2014/06/10/pure-di/
 */

import { IFileWatcher, PollingFileWatcher, readBlock } from "../FileSystem";
import { ILogWatcher, LogWatcher } from "../LogWatcher";
import { ITailWatcher, TailWatcher } from "../TailWatcher";
import { nodeFs as fs } from "./nodeFs";

export interface IKernel {
    createLogWatcher: (filename: string) => ILogWatcher;
}

export const kernel: IKernel = {
    createLogWatcher(filename) {
        const fileWatcher: IFileWatcher = new PollingFileWatcher(fs, filename, 1000);
        const tailWatcher: ITailWatcher = new TailWatcher(fileWatcher, readBlock);
        return new LogWatcher(tailWatcher);
    },
};
