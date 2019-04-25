import { IMilliseconds, ISeconds } from "../../Utils/units";

export const AVGHITS_COMPUTE = "avghits/COMPUTE";

export interface IAvgHitsCompute {
    type: typeof AVGHITS_COMPUTE;
    payload: {
        now: Date,
        ttl: IMilliseconds,
        elapsedSinceLastUpdate: ISeconds,
        avgHitsPerSecondThreshold: number,
    };
}

export const computeAvgHits = (
        now: Date, ttl: IMilliseconds,
        elapsedSinceLastUpdate: ISeconds,
        avgHitsPerSecondThreshold: number): IAvgHitsCompute => ({
    type: AVGHITS_COMPUTE,
    payload: { now, ttl, elapsedSinceLastUpdate, avgHitsPerSecondThreshold },
});
