import { List, Map } from "immutable";

export interface IBasicState {
    hits: number;
    errors: number;
    traffic: number;
}

export type StateBySections = Map<string, IBasicState>;

export interface IBatchState extends IBasicState {
    sections: StateBySections;
}

export interface IAlertMessage {
    type: "alert";
    hits: number;
    time: Date;
}

export interface IRecoverMessage {
    type: "recover";
    time: Date;
}

export type AnyMessage = IAlertMessage | IRecoverMessage;

export interface IAlertState {
    overload: number; // in seconds.
    status: "off" | "on";
    message: List<AnyMessage>;
}

export interface IState {
    hasChanged: boolean;
    currentBatch: IBatchState | null;
    allBatches: IBatchState;
    lastUpdated: Date;
    alert: IAlertState;
}
