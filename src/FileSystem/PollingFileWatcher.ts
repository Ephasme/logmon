import moment = require("moment");
import { IFileSystem, IFileWatcher, IStats } from ".";

/**
 * I created this PollingWatcher because nodejs's watch
 * and watchFile functions are a little bit buggy and
 * inconsistent accross platforms.
 *
 * Sources:  https://stackoverflow.com/a/12979775/1829285
 *           https://nodejs.org/docs/latest/api/fs.html#fs_caveats
 */
export class PollingFileWatcher implements IFileWatcher {

    private filename: string;
    private lastmtimeMs: number = 0;
    private pollingDelay: number;
    private fs: IFileSystem;

    constructor(fs: IFileSystem, filename: string, pollingDelay: number = 1000) {
        if (pollingDelay < 0) throw new Error(`Invalid argument: polling delay is supposed to be positive.`);

        this.fs = fs;
        this.filename = filename;
        this.pollingDelay = pollingDelay;
    }

    /**
     * Take a callback and call it whenever the file changes.
     * @param onChange callback which will be called at each incremental change in the file.
     */
    public watch(onChange: (stats: IStats, filename: string) => void) {
        if (this.fs.existsSync(this.filename)) {
            const stats = this.fs.statSync(this.filename);

            // This prevents old changes to fire the event.
            if (stats.mtimeMs > this.lastmtimeMs) {
                onChange(stats, this.filename);
                this.lastmtimeMs = stats.mtimeMs;
            }
        }

        setTimeout(this.watch.bind(this), this.pollingDelay, onChange);
    }
}
