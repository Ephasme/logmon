import * as fs from "fs";
import { IFileSystem, PollingFileWatcher, readBlock } from "./FileSystem";
import { LogWatcher } from "./LogWatcher";
import * as LogLineFactory from "./LogWatcher/LogLineFactory";
import { computeOverloading } from "./Store/load/actions";
import { RootState } from "./Store/states";
import { storage } from "./Store/store";
import { TailWatcher } from "./TailWatcher";
import { newLog } from "./Store/common/actions";
import { computeAnalysis } from "./Store/analysis/actions";
import { createGui } from "./GUI/render";
import { Ms, toSec, Sec } from "./Utils/units";

export const nodeFs: IFileSystem = {
    statSync: fs.statSync,
    existsSync: fs.existsSync,
};

const filename = "data/access.log";
const fileWatcher = new PollingFileWatcher(nodeFs, filename);
const tailWatcher = new TailWatcher(fileWatcher, readBlock);
const logWatcher = new LogWatcher(LogLineFactory.createFrom, tailWatcher, new Date());

const overloadMonitoringDelay = Ms(2000); // In ms
const batchAnalysisDelay = Ms(10000); // In ms
const renderDelay = Ms(500); // In ms

const hitsPerSecondThreshold = 2;
const maxOverloadDuration = Sec(20); // In seconds

const gui = createGui(console.clear, console.log);

const render = (state: RootState) => {
    gui.render(state, new Date(), hitsPerSecondThreshold, maxOverloadDuration, filename);
};

logWatcher.watch((log) => storage.dispatch(newLog(log)));

function computeOverloadingProcess() {
    storage.dispatch(computeOverloading(new Date(),
        hitsPerSecondThreshold, toSec(overloadMonitoringDelay),
        maxOverloadDuration));
}

function computeAnalysisProcess() {
    storage.dispatch(computeAnalysis(new Date()));
}

function renderProcess() {
    render(storage.state); 
}

setInterval(computeOverloadingProcess, overloadMonitoringDelay.ms);
setInterval(computeAnalysisProcess, batchAnalysisDelay.ms);
setInterval(renderProcess, renderDelay.ms);
