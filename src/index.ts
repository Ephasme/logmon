import * as fs from "fs";
import { IFileSystem, PollingFileWatcher, readBlock, IFileWatcher } from "./FileSystem";
import { LogWatcher, ILogWatcher } from "./LogWatcher";
import * as LogLineFactory from "./LogWatcher/LogLineFactory";
import { computeOverloading } from "./Store/load/actions";
import { StoreManager, IStoreManager } from "./Store/store";
import { TailWatcher, ITailWatcher } from "./TailWatcher";
import { newLog } from "./Store/common/actions";
import { computeAnalysis } from "./Store/analysis/actions";
import { createGui } from "./GUI/render";
import { Ms, toSec, Sec } from "./Utils/units";
import { getNow } from "./Time";

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
const storage: IStoreManager = new StoreManager();
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
