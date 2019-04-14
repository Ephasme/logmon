import * as blessed from "blessed";
import { nodeFs as fs } from "./FileSystem";
import { IFileWatcher, PollingFileWatcher, readBlock } from "./FileSystem";
import { ILogWatcher, LogWatcher } from "./LogWatcher";
import { ITailWatcher, TailWatcher } from "./TailWatcher";

const DEFAULT_FILE_NAME = "C:\\dev\\logmon-ts\\src\\__fixtures__\\test.log";

const fileWatcher: IFileWatcher = new PollingFileWatcher(fs, DEFAULT_FILE_NAME, 1000);
const tailWatcher: ITailWatcher = new TailWatcher(fileWatcher, readBlock);

const watcher: ILogWatcher = new LogWatcher(tailWatcher);

watcher.subscribe((log) => {
    console.log(JSON.stringify(log));
});

watcher.watch();
