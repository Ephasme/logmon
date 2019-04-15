import { kernel } from "./Container";
import { ILogLine } from "./Models/ILogLine";

const DEFAULT_FILE_NAME = "/tmp/access.log";
const watcher = kernel.createLogWatcher(DEFAULT_FILE_NAME);


const logs: ILogLine[] = [];

const pushLogs = (log: ILogLine): void => {
    logs.push(log);
    console.log(`Pushed log for [${log.request}]`)
};

watcher.subscribe(pushLogs);

console.log("Application started:")
console.log(`   * watching ${DEFAULT_FILE_NAME}`)

watcher.watch();
