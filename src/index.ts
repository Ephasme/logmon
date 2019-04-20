import * as fs from "fs";
import { IFileSystem, PollingFileWatcher, readBlock } from "./FileSystem";
import { LogWatcher } from "./LogWatcher";
import * as LogLineFactory from "./LogWatcher/LogLineFactory";
import { TailWatcher } from "./TailWatcher";
import { RootState } from "./Store/states";
import { newLogAction, computeOverloadingAction, trimLogsAction } from "./Store/actions";
import { storage } from "./Store/store";

export const nodeFs: IFileSystem = {
    statSync: fs.statSync,
    existsSync: fs.existsSync,
};

const fileWatcher = new PollingFileWatcher(nodeFs, "data/access.log");
const tailWatcher = new TailWatcher(fileWatcher, readBlock);
const logWatcher = new LogWatcher(LogLineFactory.createFrom, tailWatcher);

const overloadMonitoringDelay = 1000;
const batchAnalysisDelay = 10000;
const renderDelay = 2000;

const render = (state: RootState) => {
    console.clear();
    console.log(state);
};

logWatcher.watch((log) => {
    storage.dispatch(newLogAction(log));
});

function computeOverloadingProcess() {
    storage.dispatch(computeOverloadingAction(2 * 60, 10));
    storage.dispatch(trimLogsAction(new Date(), 2 * 60));
}

function renderProcess() {
    render(storage.state);
}

setInterval(computeOverloadingProcess, overloadMonitoringDelay);
setInterval(renderProcess, renderDelay);
