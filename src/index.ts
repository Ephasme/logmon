import { kernel } from "./Container";
import { getStatsBySections } from "./Stats/getStatsBySections";
import * as yargs from "yargs";
import { ILogLine } from "./Models/ILogLine";

const args = yargs.default("filename", "/tmp/access.log").argv;

const watcher = kernel.createLogWatcher(args.filename);

const each10seconds = kernel.createTimerMonitor(10000);
const eachSecond = kernel.createTimerMonitor(1000);

console.log("Application started:");
console.log(`   * watching ${args.filename}`);

watcher.subscribe(each10seconds);
watcher.subscribe(eachSecond);

each10seconds.run((batch: ILogLine[]) => {
    const stats = getStatsBySections(batch);
    if (stats.size > 0) {
        console.log(JSON.stringify(stats));
    }
});

eachSecond.run((batch: ILogLine[]) => {
    const alert = batch.length > 10;
    if (alert) {
        console.log("start alert");
    }
});

watcher.watch();
