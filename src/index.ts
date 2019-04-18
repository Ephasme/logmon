import * as yargs from "yargs";
import { kernel } from "./Container";
import { ILogLine } from "./Models/ILogLine";
import { defaultState } from "./Stats/defaultStates";
import { mainReducer } from "./Stats/reducers";
import { render } from "./GUI/render";

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

const secondsBetweenUpdates = parseInt(args.maxHitsPerSeconds);
const maxHitsPerSeconds = parseInt(args.secondsBetweenUpdates)

const watcher = kernel.createLogWatcher(args.filename);
const monitoring = kernel.createTimerMonitor(1000 * secondsBetweenUpdates);

console.log("Application started:");
console.log(`   * watching ${args.filename}`);

watcher.subscribe(monitoring);

let currentState = defaultState;

monitoring.run((batch: ILogLine[]) => {
    currentState = mainReducer(currentState, maxHitsPerSeconds, maxHitsPerSeconds * secondsBetweenUpdates, batch);
    render(currentState);
});

watcher.watch();
