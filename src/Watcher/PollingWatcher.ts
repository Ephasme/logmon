import { IWatcher } from ".";
import { IFileSystem, IStats } from "../FileSystem";

/**
 * I created this PollingWatcher because nodejs's watch
 * and watchFile functions are a little bit buggy and
 * qinconsistent accross platforms.
 *
 * Source: https://stackoverflow.com/a/12979775/1829285
 */
export class PollingWatcher implements IWatcher {
    private lastmtimeMs: number = 0;

    private filename: string;
    private pollingDelay: number;
    private fs: IFileSystem;

    constructor(fs: IFileSystem, filename: string, pollingDelay: number = 1000) {
        if (fs == null) throw new Error(`Argument null: fs is required.`);
        if (filename == null) throw new Error(`Argument null: filename is required.`);
        if (pollingDelay < 0) throw new Error(`Invalid argument: polling delay is supposed to be positive.`);

        this.fs = fs;
        this.filename = filename;
        this.pollingDelay = pollingDelay;
    }

    public watch(onChange: (stats: IStats) => void) {
        if (onChange == null) throw new Error("Argument null: onChange callback is required.");

        const stats = this.fs.statSync(this.filename);

        if (stats.mtimeMs > this.lastmtimeMs) {
            onChange(stats);
            this.lastmtimeMs = stats.mtimeMs;
        }

        setTimeout(this.watch.bind(this), this.pollingDelay, onChange);
    }
}
