import { ILogLine } from "../Models/ILogLine";
import { Set, Map } from "immutable";

export type LogLinesBySection = Map<string, Set<ILogLine>>;

export function groupBySections(logs: ILogLine[]): Map<string, Set<ILogLine>> {
    return (logs || [])
        .filter((x) => x.request.routeSegments.length > 0)
        .map((x) => ({
            id: x.request.routeSegments[0],
            ...x,
        }))
        .reduce((prev, cur) => {
            const newSet = prev.get(cur.id, Set<ILogLine>()).add(cur);
            return prev.set(cur.id, newSet);
        }, Map<string, Set<ILogLine>>());
}
