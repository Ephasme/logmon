import { List, Map } from "immutable";
import { IAlertState, IBasicState, IBatchState, IState } from "./types";

export const defaultBasicState: () => IBasicState = () => ({
    hits: 0,
    errors: 0,
    traffic: 0,
});

export const defaultBatchState: () => IBatchState = () => ({
    sections: Map<string, IBasicState>(),
    ...defaultBasicState(),
});

export const defaultAlertState: () => IAlertState = () => ({
    message: List(),
    overloadDuration: 0,
    status: "on",
});

export const defaultState: () => IState = () => ({
    logs: [],
    lastValidBatch: defaultBatchState(),
    currentBatch: defaultBatchState(),
    allBatches: defaultBatchState(),
    ...defaultBatchState(),
    hasChanged: false,
    lastUpdated: new Date(),
    alert: defaultAlertState(),
});
