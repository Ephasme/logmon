import { IFileSystem } from './IFileSystem';
import { Stats } from 'fs';

export interface IWatcherOptions {
    delay: number;
}

export interface IWatcher {
    watch(): void;
}

export class Watcher {
    private lastmtimeMs: number = 0;

    private filename: string;
    private options: IWatcherOptions;
    private fs: IFileSystem;

    constructor(
        fs: IFileSystem,
        filename: string,
        options: IWatcherOptions = {
            delay: 1000
        })
    {
        this.fs = fs;
        this.filename = filename;
        this.options = options;
    }

    watch(onChange: (stats: Stats) => void) {
        const stats = this.fs.statSync(this.filename);
        
        if (stats.mtimeMs > this.lastmtimeMs) {
            onChange(stats);
            this.lastmtimeMs = stats.mtimeMs;
        }

        setTimeout(this.watch.bind(this), this.options.delay, onChange);
    }
}