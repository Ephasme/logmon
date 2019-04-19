import * as yargs from "yargs";
import { kernel } from "./Container";
import { IApplicationSettings } from "./Stats/types";
import { Renderer } from "./Renderer";

const args = yargs
    .option("filename", {
        alias: "i",
        default: "/tmp/access.log",
        description: "log file to monitor",
        type: "string",
    })
    .option("secondsPerRefresh", {
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

const secondsPerRefresh = parseInt(args.secondsPerRefresh);
const appSettings: IApplicationSettings = {
    filename: args.filename,
    maxHitsPerSeconds: parseInt(args.maxHitsPerSeconds),
    secondsPerRefresh: secondsPerRefresh,
    maxOverloadDuration: 2*60,
};
const watcher = kernel.createLogWatcher(args.filename);
const monitoring = kernel.createTimerMonitor(1000 * secondsPerRefresh);

watcher.subscribe(monitoring);
const renderer = new Renderer(kernel.createMainReducer(), kernel.createGui(), appSettings);
monitoring.run(renderer.onBatch.bind(renderer));

watcher.watch();
