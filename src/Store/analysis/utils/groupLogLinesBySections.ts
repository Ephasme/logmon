import { List, Map, Set } from "immutable";
import { ILogLine } from "../../../LogWatcher";

export type GroupLogLinesBySections = (logs: List<ILogLine>) => Map<string, Set<ILogLine>>;

export const groupLogLinesBySections: GroupLogLinesBySections = (logs) => {
    return logs
        .filter((x) => x.request.routeSegments.length > 0)
        .map((x) => ({
            id: x.request.routeSegments[0],
            ...x,
        }))
        .reduce((prev, cur) => {
            const newSet = prev.get(cur.id, Set<ILogLine>()).add(cur);
            return prev.set(cur.id, newSet);
        }, Map<string, Set<ILogLine>>());
};
