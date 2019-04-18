import * as yargs from "yargs";
import { kernel } from "./Container";
import { ILogLine } from "./Models/ILogLine";
import { defaultState } from "./Stats/defaultStates";
import { mainReducer } from "./Stats/reducers";
import { render } from "./GUI/render";
import { IApplicationSettings } from "./Stats/types";

const args = yargs
    .option("filename", {
        alias: "i",
        default: "/tmp/access.log",
        description: "log file to monitor",
        type: "string",
    })
    .option("secondsBetweenUpdates", {
        alias: "t",
        default: "10",
        description: "number of hits per second over which, after two minutes, you want to raise an alert",
        type: "number",
    })
    .option("maxHitsPerSeconds", {
        alias: "f",
        default: "10",
        description: "number of seconds between each updates",
        type: "number",
    })
    .help()
    .argv;

const secondsBetweenUpdates = parseInt(args.secondsBetweenUpdates);
const appSettings: IApplicationSettings = {
    filename: args.filename,
    maxHitsPerSeconds: parseInt(args.maxHitsPerSeconds),
    secondsPerRefresh: secondsBetweenUpdates,
    maxOverloadDuration: 2*60,
};
const watcher = kernel.createLogWatcher(args.filename);
const monitoring = kernel.createTimerMonitor(1000 * secondsBetweenUpdates);

watcher.subscribe(monitoring);

let currentState = defaultState();
monitoring.run((logs: ILogLine[]) => {
    currentState = mainReducer(currentState, logs, appSettings, new Date());
    render(currentState, appSettings);
});

watcher.watch();
