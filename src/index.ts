import * as yargs from "yargs";
import { kernel } from "./Container";
import { ILogLine } from "./Models/ILogLine";
import { mainReducer } from "./Stats/reducers";
import { defaultState } from "./Stats/defaultStates";

const args = yargs.default("filename", "/tmp/access.log").argv;

const watcher = kernel.createLogWatcher(args.filename);
const each10seconds = kernel.createTimerMonitor(10000);

console.log("Application started:");
console.log(`   * watching ${args.filename}`);

watcher.subscribe(each10seconds);

let currentState = defaultState;

each10seconds.run((batch: ILogLine[]) => {
    currentState = mainReducer(currentState, batch);
    if (currentState.hasChanged) {
        console.log(JSON.stringify(currentState, null, 4));
    }
});

watcher.watch();
