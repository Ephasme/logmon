import { createReadStream } from "fs";
import * as readline from "readline";
import { nodeFs as fs } from "./FileSystem";
import { ILogLine } from "./Models/ILogLine";
import { create } from "./Models/LogLineFactory";
import { IWatcher, PollingWatcher } from "./Watcher";

const DEFAULT_FILE_NAME = "C:\\dev\\logmon-ts\\src\\test.log";

let start = 0;

const watcher: IWatcher = new PollingWatcher(fs, DEFAULT_FILE_NAME);

interface IBlock {
    start: number;
    end: number;
}

function readLogs(filename: string, block: IBlock, cb: (log: ILogLine) => void) {
    const rs = createReadStream(filename, block);
    const rl = readline.createInterface(rs);
    rl.addListener("line", (line) => {

        if (line.trim() !== "") {
            const result = create(line);
            if (result) {
                cb(result);
            }
        }
    });
}

watcher.watch((stats) => {
    const end = stats.size;

    if (end < start) {
        start = end;
    }

    readLogs(DEFAULT_FILE_NAME, { start, end }, (log: ILogLine) => {
        console.log(JSON.stringify(log));
    });

    start = end;
});
