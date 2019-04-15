import { ILogLine } from "../Models/ILogLine";

export function *fetchByTime(logs: ILogLine[], after: Date): IterableIterator<ILogLine> {
    for (const logLine of logs) {
        if (logLine.time > after) {
            yield logLine;
        }
    }
}

export function groupByFirstRouteSegment(logs: ILogLine[]): Map<string, Set<ILogLine>> {
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
/* 
export function displayStats(logs: Map<string, Set<ILogLine>>) {
    logs.forEach((val, key) => {
        const values = Array.from(val.values());
        const sumDurations = values.reduce((acc, el) => acc + el.duration, 0);
        console.log(`${key}: ${sumDurations / values.length}`);
    });
} */
