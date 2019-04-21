import { Seconds } from "../../Utils/units";

export const UPDATE_LOAD = "alert/UPDATE_LOAD";

export interface IComputeOverloadingAction {
    type: typeof UPDATE_LOAD;
    payload: {
        now: Date,
        elapsedSinceLastUpdate: Seconds,
        hitsPerSecondThreshold: number;
        maxOverloadDuration: Seconds;
    };
}

export const computeOverloading = (
    now: Date, hitsPerSecondThreshold: number,
    elapsedSinceLastUpdate: Seconds,
    maxOverloadDuration: Seconds): IComputeOverloadingAction =>
    ({ type: UPDATE_LOAD, payload: {
        now, elapsedSinceLastUpdate, 
        hitsPerSecondThreshold, 
        maxOverloadDuration }});
