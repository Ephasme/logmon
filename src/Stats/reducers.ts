import * as moment from "moment";
import { ILogLine } from "../Models/ILogLine";
import { defaultBatchState } from "./defaultStates";
import { IBasicState, IState, StateBySections, IBatchState } from "./types";
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

export const reduceAlert = (state: IState, currentBatch: IBatchState) => {
    let overloadDuration = state.overloadDuration;
    let message = state.message;
    if (currentBatch.traffic < 10) {
        overloadDuration = Math.max(0, overloadDuration - 10);
    } else {
        overloadDuration = Math.min(30, overloadDuration + 10);
    }

    if (overloadDuration === 30) {
        message = "alert";
    }

    if (overloadDuration === 0) {
        if (message === "alert") {
            message = null;
        }
    }
    return {
        overloadDuration,
        message,
    };
};

export function mainReducer(state: IState, threshold: number, input: ILogLine[]): IState {

    const currentBatch = reduceCurrentBatch(reduceSections(input));

    // nominal to trigger =>
    //      now - last nominal > @


    return {
        currentBatch,
        allBatches: mergeBatches(state.allBatches, currentBatch),
        hasChanged: true,
        lastUpdated: new Date(),
        ...reduceAlert(state, currentBatch),
    };
}
