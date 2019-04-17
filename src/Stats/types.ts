import { Map } from "immutable";

export interface IBasicState { 
    hits: number;
    errors: number;
    traffic: number;
}

export type StateBySections = Map<string, IBasicState>;

export interface IBatchState extends IBasicState {
    sections: StateBySections;
}

export interface IState {
    hasChanged: boolean;
    currentBatch: IBatchState;
    allBatches: IBatchState;
    lastUpdated: Date;
}
