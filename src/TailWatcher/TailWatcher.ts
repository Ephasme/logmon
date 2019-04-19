import { BlockReader, IFileWatcher } from "../FileSystem";
import { ITailWatcher } from ".";

export class TailWatcher implements ITailWatcher {
    private cursor = 0;
    private readBlock: BlockReader;
    private watcher: IFileWatcher;

    constructor(watcher: IFileWatcher, readBlock: BlockReader) {
        this.readBlock = readBlock;
        this.watcher = watcher;
    }

    public watch(onData: (data: string) => void) {
        this.watcher.watch((stats, filename) => {
            const end = stats.size;
            if (end > this.cursor) {
                this.readBlock(filename, { start: this.cursor, end }, onData);
            }
            this.cursor = end;
        });
    }
}
