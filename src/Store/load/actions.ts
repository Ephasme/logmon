import { ISeconds } from "../../Utils/units";

export const UPDATE_LOAD = "alert/UPDATE_LOAD";

export interface IComputeOverloading {
    type: typeof UPDATE_LOAD;
    payload: {
        now: Date,
        elapsedSinceLastUpdate: ISeconds,
        hitsPerSecondThreshold: number;
        maxOverloadDuration: ISeconds;
    };
}

export const computeOverloading = (
    now: Date, hitsPerSecondThreshold: number,
    elapsedSinceLastUpdate: ISeconds,
    maxOverloadDuration: ISeconds): IComputeOverloading =>
    ({ type: UPDATE_LOAD, payload: {
        now, elapsedSinceLastUpdate,
        hitsPerSecondThreshold,
        maxOverloadDuration }});
