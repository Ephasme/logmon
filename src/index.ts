import { kernel } from "./Container";

const DEFAULT_FILE_NAME = "/tmp/access.log";
const watcher = kernel.createLogWatcher(DEFAULT_FILE_NAME);

watcher.subscribe((log) => {
    console.log(JSON.stringify(log));
});

watcher.watch();
