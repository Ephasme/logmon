import { ILogLine } from "../Models/ILogLine";
import { defaultBatchState } from "./defaultStates";
import { IAlertState, IBasicState, IBatchState, IState, StateBySections, IApplicationSettings } from "./types";
import { groupBySections } from "./utils";
import { add, mergeBatches } from "./utils";

export const reduceErrors = (state: number, input: number): number =>
    input >= 200 && input <= 299 ? state : state + 1;

const reduceHits = (state: number): number =>
    state + 1;

const reduceTraffic = (state: number, input: number): number =>
    state + input;

const reduceSection = (state: IBasicState, input: ILogLine) => ({
    errors: reduceErrors(state.errors, input.result),
    hits: reduceHits(state.hits),
    traffic: reduceTraffic(state.traffic, input.packet),
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
    }), defaultBatchState());
};

export const reduceAlert = (state: IAlertState, currentBatch: IBatchState, appSettings: IApplicationSettings, now: Date) => {
    const newState = Object.assign({}, state);
    const {
        maxHitsPerSeconds,
        maxOverloadDuration,
   } = appSettings;

    if (currentBatch.hits < maxHitsPerSeconds) {
        newState.overloadDuration = Math.max(0, state.overloadDuration - appSettings.secondsPerRefresh);
    } else {
        newState.overloadDuration = Math.min(maxOverloadDuration, state.overloadDuration + appSettings.secondsPerRefresh);
    }

    if (newState.overloadDuration === maxOverloadDuration && state.status !== "off") {
        newState.status = "off";
        newState.message = state.message.unshift({ type: "alert", hits: currentBatch.hits, time: now });
    }

    if (newState.overloadDuration === 0) {
        if (state.status === "off") {
            newState.message = state.message.unshift({ type: "recover", time: now });
        }
        newState.status = "on";
    }
    return newState;
};

export type MainReducer = (state: IState, logs: ILogLine[], appSettings: IApplicationSettings, now: Date) => IState;

export const mainReducer: MainReducer = (state, logs, appSettings, now) => {

    const currentBatch = reduceCurrentBatch(reduceSections(logs));

    return {
        currentBatch,
        lastValidBatch: state.currentBatch.sections.size > 0
            ? state.currentBatch
            : state.lastValidBatch,
        allBatches: mergeBatches(state.allBatches, currentBatch),
        hasChanged: true,
        lastUpdated: new Date(),
        alert: reduceAlert(state.alert, currentBatch, appSettings, now),
    };
}
