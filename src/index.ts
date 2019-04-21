import * as fs from "fs";
import { IFileSystem, IFileWatcher, PollingFileWatcher, readBlock } from "./FileSystem";
import { createGui } from "./GUI/render";
import { ILogWatcher, LogWatcher } from "./LogWatcher";
import * as LogLineFactory from "./LogWatcher/LogLineFactory";
import { computeAnalysis } from "./Store/analysis/actions";
import { analysisReducer } from "./Store/analysis/reducers";
import { newLog } from "./Store/common/actions";
import { computeOverloading } from "./Store/load/actions";
import { loadReducer } from "./Store/load/reducers";
import { IStoreManager, StoreManager } from "./Store/store";
import { ITailWatcher, TailWatcher } from "./TailWatcher";
import { getNow } from "./Time";
import { Ms, Sec, toSec } from "./Utils/units";

// Application settings.
const filename = "data/access.log";
const overloadMonitoringDelay = Ms(2000);
const batchAnalysisDelay = Ms(10000);
const renderDelay = Ms(500);

const hitsPerSecondThreshold = 2;
const maxOverloadDuration = Sec(20);

// Poor man DI
export const nodeFs: IFileSystem = {
    statSync: fs.statSync,
    existsSync: fs.existsSync,
};
const fileWatcher: IFileWatcher = new PollingFileWatcher(nodeFs, filename);
const tailWatcher: ITailWatcher = new TailWatcher(fileWatcher, readBlock);
const logWatcher: ILogWatcher = new LogWatcher(LogLineFactory.createFrom, tailWatcher, getNow);
const storage: IStoreManager = new StoreManager(loadReducer, analysisReducer);
const gui = createGui(console.clear, console.log);

// Start watcher.
logWatcher.watch((log) => storage.dispatch(newLog(log)));

// Start running processes.
setInterval(() => {
    storage.dispatch(computeOverloading(getNow(),
        hitsPerSecondThreshold, toSec(overloadMonitoringDelay),
        maxOverloadDuration));
}, overloadMonitoringDelay.ms);

setInterval(() => {
    storage.dispatch(computeAnalysis(getNow()));
}, batchAnalysisDelay.ms);

setInterval(() => {
    gui.render(storage.state, getNow(), hitsPerSecondThreshold, maxOverloadDuration, filename);
}, renderDelay.ms);
