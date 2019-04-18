import { List, Map } from "immutable";
import { ILogLine } from "../Models/ILogLine";

export interface IApplicationSettings {
    maxHitsPerSeconds: number;
    maxOverloadDuration: number;
    secondsPerRefresh: number;
    filename: string;
}

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
    overloadDuration: number; // in seconds.
    status: "off" | "on";
    message: List<AnyMessage>;
}

export type IState = {
    logs: ILogLine[],
    hasChanged: boolean;
    lastValidBatch: IBatchState;
    currentBatch: IBatchState;
    allBatches: IBatchState;
    lastUpdated: Date;
    alert: IAlertState;
}
