import * as fs from "fs";
import * as yargs from "yargs";
import { IFileSystem, IFileWatcher, PollingFileWatcher, readBlock } from "./FileSystem";
import { createGui } from "./GUI/render";
import { ILogWatcher, LogWatcher } from "./LogWatcher";
import * as LogLineFactory from "./LogWatcher/LogLineFactory";
import { computeAnalysis } from "./Store/analysis/actions";
import { analysisReducer } from "./Store/analysis/reducers";
import { createBasicStatsFrom } from "./Store/analysis/utils/createBasicStatsFrom";
import { groupLogLinesBySections } from "./Store/analysis/utils/groupLogLinesBySections";
import { newLog } from "./Store/common/actions";
import { computeOverloading } from "./Store/load/actions";
import { loadReducer } from "./Store/load/reducers";
import { defaultStateFactory } from "./Store/states";
import { IStoreManager, StoreManager } from "./Store/store";
import { ITailWatcher, TailWatcher } from "./TailWatcher";
import { getNow } from "./Time";
import { Ms, Sec, toSec } from "./Utils/units";

// Gather cli args.
const args = yargs
    .option("filename", {
        alias: "f",
        default: "/tmp/access.log",
        description: "Path to the monitored log file.",
        type: "string",
    })
    .option("renderDelay", {
        default: 500,
        description: "Delay between screen refreshing (in milliseconds).",
        type: "number",
    })
    .option("overloadMonitoringDelay", {
        default: 2000,
        description: "Frequency of traffic overloading monitoring (in milliseconds).",
        type: "number",
    })
    .option("maxOverloadDuration", {
        default: 120, // Two minutes by default.
        description: "The time of overloading necessary before any alert or recovering is raised (in seconds).",
        type: "number",
    })
    .option("batchAnalysisDelay", {
        default: 10_000, // Ten seconds by default.
        description: "Frequency of traffic analysis (in milliseconds).",
        type: "number",
    })
    .option("hitsPerSecondThreshold", {
        alias: "t",
        default: 10, // In hits per seconds.
        description: "Number of hits per second over which, after two minutes, you want to raise an alert.",
        type: "number",
    })
    .help()
    .argv;

// Application settings.
const filename = args.filename;
const overloadMonitoringDelay = Ms(args.overloadMonitoringDelay);
const batchAnalysisDelay = Ms(args.batchAnalysisDelay);
const renderDelay = Ms(args.renderDelay);

const hitsPerSecondThreshold = args.hitsPerSecondThreshold;
const maxOverloadDuration = Sec(args.maxOverloadDuration);

// Poor man DI
export const nodeFs: IFileSystem = {
    statSync: fs.statSync,
    existsSync: fs.existsSync,
};
const fileWatcher: IFileWatcher = new PollingFileWatcher(nodeFs, filename);
const tailWatcher: ITailWatcher = new TailWatcher(fileWatcher, readBlock);
const logWatcher: ILogWatcher = new LogWatcher(LogLineFactory.createFrom, tailWatcher, getNow);
const storage: IStoreManager = new StoreManager(
    defaultStateFactory(), loadReducer, analysisReducer(createBasicStatsFrom, groupLogLinesBySections));
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
