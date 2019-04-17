import { ILogLine } from "../Models/ILogLine";
import { groupBySections } from "./utils";
import { IBasicState, IState, StateBySections } from "./types";
import { add, mergeBatches } from "./utils";
import { defaultBatchState } from "./defaultStates";

const reduceErrors = (state: number, input: ILogLine): number =>
    input.result >= 200 && input.result <= 299 ? state : state + 1;

const reduceHits = (state: number): number =>
    state + 1;

const reduceTraffic = (state: number, input: ILogLine): number =>
    state + input.packet;

const reduceSection = (state: IBasicState, input: ILogLine) => ({
    errors: reduceErrors(state.errors, input),
    hits: reduceHits(state.hits),
    traffic: reduceTraffic(state.traffic, input),
});

const reduceSections = (input: ILogLine[]) => groupBySections(input).map((set) => {
    return set.reduce<IBasicState>(reduceSection, {
        errors: 0,
        hits: 0,
        traffic: 0,
    });
});

const reduceCurrentBatch = (input: StateBySections) => {
    return input.reduce((acc, el) => ({
        sections: input,
        ...add(acc, el),
    }), defaultBatchState);
}

export function mainReducer(state: IState, input: ILogLine[]): IState {
    if (input === null || input.length === 0) return {...state, hasChanged: false };

    const currentBatch = reduceCurrentBatch(reduceSections(input));

    return {
        currentBatch,
        allBatches: mergeBatches(state.allBatches, currentBatch),
        hasChanged: true,
        lastUpdated: new Date(),
    };    
}
