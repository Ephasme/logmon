import { ILogLine } from "../Models/ILogLine";
import { defaultBatchState } from "./defaultStates";
import { IAlertState, IBasicState, IBatchState, IState, StateBySections } from "./types";
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

const alertMessage = (value: number, now: Date) =>
    `High traffic generated an alert - hits = ${value}, triggered at ${now}`;

const recoverMessage = () =>
    `Recovered from high traffic at ${new Date()}`;

export const reduceAlert = (state: IAlertState, currentBatch: IBatchState,
                            now: Date, highHits: number, maxOverload: number): IAlertState => {
    const newState = Object.assign({}, state);

    if (currentBatch.hits < highHits) {
        newState.overload = Math.max(0, state.overload - 1);
    } else {
        newState.overload = Math.min(maxOverload, state.overload + 1);
    }

    if (newState.overload === maxOverload) {
        newState.status = "off";
        newState.message = state.message.unshift({ type: "alert", hits: currentBatch.hits, time: now });
    }

    if (newState.overload === 0) {
        if (state.status === "off") {
            newState.message = state.message.unshift({ type: "recover", time: now });
        }
        newState.status = "on";
    }
    return newState;
};

export function mainReducer(state: IState, highHits: number, maxOverload: number, input: ILogLine[]): IState {

    const currentBatch = reduceCurrentBatch(reduceSections(input));

    // nominal to trigger =>
    //      now - last nominal > @

    return {
        currentBatch,
        allBatches: mergeBatches(state.allBatches, currentBatch),
        hasChanged: true,
        lastUpdated: new Date(),
        alert: reduceAlert(state.alert, currentBatch, new Date(), highHits, maxOverload),
    };
}
