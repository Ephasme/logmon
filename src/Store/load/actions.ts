export const UPDATE_LOAD = "alert/UPDATE_LOAD";

export interface IComputeOverloadingAction {
    type: typeof UPDATE_LOAD;
    payload: {
        now: Date,
        elapsedSinceLastUpdate: number,
        hitsPerSecondThreshold: number;
        maxOverloadDuration: number;
    };
}

export const computeOverloading = (
    now: Date, hitsPerSecondThreshold: number,
    elapsedSinceLastUpdate: number,
    maxOverloadDuration: number): IComputeOverloadingAction =>
    ({ type: UPDATE_LOAD, payload: {
        now, elapsedSinceLastUpdate, 
        hitsPerSecondThreshold, 
        maxOverloadDuration }});
