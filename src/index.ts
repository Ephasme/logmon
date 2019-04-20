import * as fs from "fs";
import { IFileSystem, PollingFileWatcher, readBlock } from "./FileSystem";
import { ILogLine, LogWatcher } from "./LogWatcher";
import * as LogLineFactory from "./LogWatcher/LogLineFactory";
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

export const newLogAction = (log: ILogLine): INewLogAction =>
    ({ type: "NEW_LOG", payload: { log }});

export const trimLogsAction = (now: Date, ttl: number): ITrimLogAction =>
    ({ type: "TRIM_LOGS", payload: { now, ttl }});

export const computeOverloadingAction = (timespan: number, threshold: number): IComputeOverloadingAction =>
    ({ type: "COMPUTE_OVERLOADING", payload: { timespan, threshold }});

// export const mainReducer = (state: IState, action: AnyAction) => {
//     return logsReducer(state, action);
// }

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
setInterval(renderProcess, 2000);
