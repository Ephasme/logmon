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
import { computeAvgHits } from "./Store/avghits/actions";
import { avgHitsReducer } from "./Store/avghits/reducers";
import { newLog } from "./Store/common/actions";
import { defaultStateFactory } from "./Store/states";
import { IStoreManager, StoreManager } from "./Store/store";
import { ITailWatcher, TailWatcher } from "./TailWatcher";
import { getNow } from "./Time";
import { Ms, Sec, toMs, toSec } from "./Utils/units";

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
    .option("batchAnalysisDelay", {
        default: 10_000, // Ten seconds by default.
        description: "Frequency of traffic analysis (in milliseconds).",
        type: "number",
    })
    .option("avgHitsPerSecondsThreshold", {
        default: 10,
        description: "If the average number of hits per seconds for the past two " +
                     "minutes goes over this value, we raise an alert.",
        type: "number",
    })
    .option("avgHitsPerSecondsDuration", {
        default: 120,
        description: "The sliding average is calculated over this number of seconds.",
        type: "number",
    })
    .option("avgHitsPerSecondsDelay", {
        default: 2000,
        description: "Frequency of hits per seconds alert checking (in milliseconds).",
        type: "number",
    })
    .help()
    .argv;

const appSettings = {
    filename: args.filename,
    batchAnalysisDelay: Ms(args.batchAnalysisDelay),
    avgHitsPerSecondsDelay: Ms(args.avgHitsPerSecondsDelay),
    avgHitsPerSecondsDuration: Sec(args.avgHitsPerSecondsDuration),
    avgHitsPerSecondsThreshold: args.avgHitsPerSecondsThreshold,
    renderDelay: Ms(args.renderDelay),
};

// Poor man DI
export const nodeFs: IFileSystem = {
    statSync: fs.statSync,
    existsSync: fs.existsSync,
};
const fileWatcher: IFileWatcher = new PollingFileWatcher(nodeFs, appSettings.filename);
const tailWatcher: ITailWatcher = new TailWatcher(fileWatcher, readBlock);
const logWatcher: ILogWatcher = new LogWatcher(LogLineFactory.createFrom, tailWatcher, getNow);
const storage: IStoreManager = new StoreManager(
    defaultStateFactory(), avgHitsReducer, analysisReducer(createBasicStatsFrom, groupLogLinesBySections));
const gui = createGui(console.clear, console.log);

// Start watcher.
logWatcher.watch((log) => storage.dispatch(newLog(log)));

setInterval(() => {
    storage.dispatch(computeAvgHits(getNow(),
        toMs(appSettings.avgHitsPerSecondsDuration),
        toSec(appSettings.avgHitsPerSecondsDelay),
        appSettings.avgHitsPerSecondsThreshold));
}, appSettings.avgHitsPerSecondsDelay.ms);

setInterval(() => {
    storage.dispatch(computeAnalysis(getNow()));
}, appSettings.batchAnalysisDelay.ms);

setInterval(() => {
    gui.render(storage.state, getNow(),
        appSettings.filename,
        appSettings.avgHitsPerSecondsThreshold,
        appSettings.avgHitsPerSecondsDuration);
}, appSettings.renderDelay.ms);
