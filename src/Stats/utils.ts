import { IBasicState, StateBySections, IBatchState } from "./types";
import { ILogLine } from "../Models/ILogLine";
import { Set, Map } from "immutable";

export type Adder<T> = (state1: T, state2: T) => T;
export type BasicStateAdder = Adder<IBasicState>;
export type StateBySectionsAdder = Adder<StateBySections>;
export type BatchStateAdder = Adder<IBatchState>;

export const add: BasicStateAdder = (state1, state2) => ({
    errors: state2.errors + state1.errors,
    hits: state2.hits + state1.hits,
    traffic: state2.traffic + state1.traffic,
});

export const mergeSections: StateBySectionsAdder = (sections1, sections2) =>
    sections1.mergeWith((prev, next) => add(prev, next), sections2);

export const mergeBatches: BatchStateAdder = (batch1, batch2) => ({
    sections: mergeSections(batch1.sections, batch2.sections),
    ...add(batch1, batch2),
});

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