import { IWatcher } from ".";
import { IFileSystem, IStats } from "../FileSystem";

/**
 * I created this PollingWatcher which is not ideal
 * because the nodejs watch and watchFile functions are
 * a little bit buggy and inconsistent accross platforms.
 *
 * Source: https://stackoverflow.com/a/12979775/1829285
 */
export class PollingWatcher implements IWatcher {
    private lastmtimeMs: number = 0;

    private filename: string;
    private poolingDelay: number;
    private fs: IFileSystem;

    constructor(
        fs: IFileSystem,
        filename: string,
        poolingDelay: number = 1000) {
        this.fs = fs;
        this.filename = filename;
        this.poolingDelay = poolingDelay;
    }

    public watch(onChange: (stats: IStats) => void) {
        const stats = this.fs.statSync(this.filename);

        if (stats.mtimeMs > this.lastmtimeMs) {
            onChange(stats);
            this.lastmtimeMs = stats.mtimeMs;
        }

        setTimeout(this.watch.bind(this), this.poolingDelay, onChange);
    }
}
