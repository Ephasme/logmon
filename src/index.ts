import { createReadStream } from "fs";
import * as readline from "readline";
import { nodeFs as fs } from "./FileSystem";
import { ILogLineDto, parseLogLine } from "./LogMonitor/LogLineParser";
import { IWatcher, PollingWatcher } from "./Watcher";

const DEFAULT_FILE_NAME = "C:\\dev\\logmon-ts\\src\\test.log";

let start = 0;

const watcher: IWatcher = new PollingWatcher(fs, DEFAULT_FILE_NAME);

interface IBlock {
    start: number;
    end: number;
}

function readLogs(filename: string, block: IBlock, cb: (log: ILogLineDto) => void) {
    const rs = createReadStream(filename, block);
    const rl = readline.createInterface(rs);
    rl.addListener("line", (line) => {

        if (line.trim() !== "") {
            const result = parseLogLine(line);
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

    readLogs(DEFAULT_FILE_NAME, { start, end }, (log: ILogLineDto) => {
        console.log(JSON.stringify(log));
    });

    start = end;
});
