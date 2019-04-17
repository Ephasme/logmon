import { ILogLine } from "../Models/ILogLine";
import { ITimerMonitor } from "./ITimerMonitor";

export class TimerMonitor implements ITimerMonitor {
    private duration: number;
    private batch: ILogLine[] = [];

    constructor(duration: number) {
        this.duration = duration;
    }

    public onLog(log: ILogLine) {
        this.batch.push(log);
    }

    public run(onBatch: (batch: ILogLine[]) => void) {
        const currentBatch = this.swapBatches();
        onBatch(currentBatch);
        setTimeout(() => this.run(onBatch), this.duration);
    }

    private swapBatches(): ILogLine[] {
        const currentBatch = this.batch;
        this.batch = [];
        return currentBatch;
    }
}
