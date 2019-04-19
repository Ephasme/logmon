/**
 * Implemented a Pure DI pattern.
 * Better than using a full fledged DI Container.
 * Source: https://blog.ploeh.dk/2014/06/10/pure-di/
 */

import { IFileWatcher, PollingFileWatcher, readBlock } from "../FileSystem";
import { ILogWatcher, LogWatcher } from "../LogWatcher";
import { createFrom as logLineFactory } from "../Models/LogLineFactory";
import { ITailWatcher, TailWatcher } from "../TailWatcher";
import { ITimerMonitor, TimerMonitor } from "../TimerMonitor";
import { nodeFs as fs } from "./nodeFs";
import { MainReducer, mainReducer } from "../Stats/reducers";
import { IGui, createGui as guiFactory } from "../GUI/render";
import { IState, IApplicationSettings } from "../Stats/types";
import { ILogLine } from "../Models/ILogLine";

export interface IKernel {
    createLogWatcher: (filename: string) => ILogWatcher;
    createTimerMonitor: (duration: number) => ITimerMonitor;
    createMainReducer: () => MainReducer;
    createGui: () => IGui;
}

function createLogWatcher(filename: string): ILogWatcher {
    const fileWatcher: IFileWatcher = new PollingFileWatcher(fs, filename, 1000);
    const tailWatcher: ITailWatcher = new TailWatcher(fileWatcher, readBlock);
    return new LogWatcher(logLineFactory, tailWatcher);
};

function createTimerMonitor(duration: number): ITimerMonitor {
    return new TimerMonitor(duration);
};

function createMainReducer(): MainReducer {
    return (state: IState, logs: ILogLine[], appSettings: IApplicationSettings, now: Date) =>
        mainReducer(state, logs, appSettings, now);
};

function createGui(): IGui {
    return guiFactory(console.clear, console.log);
};

export const kernel: IKernel = {
    createLogWatcher,
    createTimerMonitor,
    createMainReducer,
    createGui,
};
