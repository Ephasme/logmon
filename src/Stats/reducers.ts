import * as moment from "moment";
import { ILogLine } from "../Models/ILogLine";
import { defaultBatchState } from "./defaultStates";
import { IBasicState, IBatchState, IState, StateBySections, Transition } from "./types";
import { groupBySections } from "./utils";
import { add, mergeBatches } from "./utils";

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
};

const runTransition: Transition = (state, now, currentTraffic, threshold) => {
    const isHigh = currentTraffic > threshold;
    const minutesSinceLastEvent = moment.duration(moment(now).diff(moment(state.since))).asSeconds();
    if (state.name === "idle" && isHigh) return { name: "warming up", since: new Date() };
    if (state.name === "idle" && !isHigh) return state;

    if (state.name === "warming up" && isHigh) {
        return minutesSinceLastEvent < 2 * 60 ? state : {
            name: "triggered",
            since: new Date(),
        };
    }
    if (state.name === "warming up" && !isHigh) return { name: "idle", since: new Date() };

    if (state.name === "triggered" && !isHigh) return { name: "cooling down", since: new Date() };
    if (state.name === "triggered" && isHigh) return { name: "triggered", since: new Date() };

    if (state.name === "cooling down" && isHigh) return { name: "warming up", since: new Date() };
    if (state.name === "cooling down" && !isHigh) {
        return minutesSinceLastEvent < 2 * 60 ? state : {
            name: "idle",
            since: new Date(),
        };
    }
    return state;
};

export function mainReducer(state: IState, threshold: number, input: ILogLine[]): IState {
    if (input === null || input.length === 0) { return {
        ...state,
        currentBatch: null,
        alertState: runTransition(state.alertState, new Date(), 0, threshold),
    };
    }

    const currentBatch = reduceCurrentBatch(reduceSections(input));

    return {
        currentBatch,
        allBatches: mergeBatches(state.allBatches, currentBatch),
        hasChanged: true,
        lastUpdated: new Date(),
        alertState: runTransition(state.alertState, new Date(), currentBatch.traffic, threshold),
    };
}
