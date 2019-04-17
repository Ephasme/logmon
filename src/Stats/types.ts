import { Map } from "immutable";

export interface IBasicState {
    hits: number;
    errors: number;
    traffic: number;
}

export interface IAlertState {
    name: "idle" | "warming up" | "triggered" | "cooling down";
    since: Date;
}

export type Transition = (state: IAlertState, now: Date, currentTraffic: number, threshold: number) => AlertState;

export type StateBySections = Map<string, IBasicState>;

export interface IBatchState extends IBasicState {
    sections: StateBySections;
}

export interface IState {
    hasChanged: boolean;
    currentBatch: IBatchState | null;
    allBatches: IBatchState;
    lastUpdated: Date;
    alertState: IAlertState;
}
