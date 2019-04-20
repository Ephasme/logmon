import * as fs from "fs";
import { IFileSystem, PollingFileWatcher, readBlock } from "./FileSystem";
import { LogWatcher } from "./LogWatcher";
import * as LogLineFactory from "./LogWatcher/LogLineFactory";
import { computeOverloadingAction as computeOverloading, newLogAction as addLog, trimLogsAction as trimLogs } from "./Store/actions";
import { RootState } from "./Store/states";
import { storage } from "./Store/store";
import { TailWatcher } from "./TailWatcher";

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
    storage.dispatch(addLog(log));
});

function computeOverloadingProcess() {
    storage.dispatch(computeOverloading(2 * 60, 10));
    storage.dispatch(trimLogs(new Date(), 2 * 60));
}

function renderProcess() {
    render(storage.state);
}

setInterval(computeOverloadingProcess, overloadMonitoringDelay);
setInterval(renderProcess, renderDelay);
