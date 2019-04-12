import { node_fs as fs } from './FileSystem';
import { IWatcher, PollingWatcher } from './Watcher';
import { createReadStream } from 'fs';
import * as readline from 'readline';

const DEFAULT_FILE_NAME = "C:\\dev\\logmon-ts\\src\\test.log";

let start = 0;

const watcher: IWatcher = new PollingWatcher(fs, DEFAULT_FILE_NAME);

watcher.watch(stats => {
    const end = stats.size;

    if (end < start) {
        start = end;
    }

    const rs = createReadStream(DEFAULT_FILE_NAME, { start, end });
    const rl = readline.createInterface(rs);

    console.log({ start, end });
    rl.addListener("line", (line) => {
        if (line.trim() !== "") {
            console.log("Line: " + line);
        }
    })

    start = end;
});
