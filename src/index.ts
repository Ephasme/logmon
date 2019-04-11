import { node_fs as fs } from './IFileSystem';
import { Watcher } from './Watcher';

const DEFAULT_FILE_NAME = "C:\\dev\\logmon-ts\\src\\test.log";

let currentPosition = 0;

const watcher1 = new Watcher(fs, DEFAULT_FILE_NAME);

watcher1.watch(stats => {
    console.log(currentPosition);
    console.log(stats.size - 1);

    currentPosition = stats.size;
});
