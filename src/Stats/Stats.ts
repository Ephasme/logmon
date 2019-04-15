import { ILogLine } from "../Models/ILogLine";

function getSection(log: ILogLine): string | null {
    if (log.request.routeSegments.length > 0) {
        const section = log.request.routeSegments[0];
        if (section) {
            return section;
        }
    }
}

export function groupBySections(logs: ILogLine[]): Map<string, Set<ILogLine>> {
    return (logs || [])
        .filter((x) => x.request.routeSegments.length > 0)
        .map((x) => ({
            id: x.request.routeSegments[0],
            ...x,
        }))
        .reduce((prev, cur) => {
            if (!prev.has(cur.id)) {
                prev.set(cur.id, new Set<ILogLine>());
            }
            prev.get(cur.id).add(cur);
            return prev;
        }, new Map<string, Set<ILogLine>>());
}

function computeDuration(set: Set<ILogLine>) {
    return Array.from(set).reduce((acc, el) => {
        return acc + el.duration;
    }, 0);
}

export class Stats {
    public logBatch: ILogLine[] = [];

    public constructor() {
        this.logBatch = [];
    }
    
    private swapBatches(): ILogLine[] {
        const currentBatch = this.logBatch;
        this.logBatch = [];
        return currentBatch;
    }

    public run() {
        const currentBatch = this.swapBatches();
        const batchBySection = groupBySections(currentBatch);
        for (const it of batchBySection) {
            console.log(`${it[0]} => ${computeDuration(it[1])} s`);
        }
        setTimeout(() => this.run(), 10000);
    }
    public onLog(log: ILogLine) {
        this.logBatch.push(log);
    }
}