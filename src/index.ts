import { PollingFileWatcher, IFileSystem, readBlock } from "./FileSystem";
import * as fs from "fs";
import { LogWatcher, ILogLine } from "./LogWatcher";
import * as LogLineFactory from "./LogWatcher/LogLineFactory"
import { TailWatcher } from "./TailWatcher";
import { TimerMonitor } from "./TimerMonitor";
import { Set, List } from "immutable"
import { hitsBySeconds as hitsPerSeconds } from "./hitsBySeconds";
import { timeBoundaries } from "./timeBoudaries";
import moment = require("moment");

export const nodeFs: IFileSystem = {
    statSync: fs.statSync,
    existsSync: fs.existsSync,
};

const fileWatcher = new PollingFileWatcher(nodeFs, "data/access.log");
const tailWatcher = new TailWatcher(fileWatcher, readBlock);
const logWatcher = new LogWatcher(LogLineFactory.createFrom, tailWatcher);
const monitor = new TimerMonitor(logWatcher);

monitor.watch();

// Time elapsed since last analysis in milliseconds.
let elapsedSinceAnalysis = 0;

// Batch of logline to analyze.
let toAnalyze: ILogLine[] = [];

const delay = 1000;
const analysisDelay = 10000;

type IState = {
    time: number;
    hits: number;
};

const state: IState = {
    time: 0,
    hits: 0,
}

function main() {
    console.clear();
    const batch = Array.from(monitor.flush());

    if (batch.length === 0) {
        console.log("zero batch");
    }

    elapsedSinceAnalysis += delay;
    
    const result = timeBoundaries(List(batch));
    const ms = moment(result.older.time).diff(result.younger.time, "s");

    state.time = ms;
    state.hits = batch.length;

    for (const log of batch) {
        toAnalyze.push(log);
    }

    if (elapsedSinceAnalysis > analysisDelay) {
        
        toAnalyze = [];
        elapsedSinceAnalysis = 0;
    }

    console.log(state);

    setTimeout(() => main(), delay);
}

main();
