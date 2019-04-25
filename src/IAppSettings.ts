import { IMilliseconds, ISeconds } from "./Utils/units";
// Application settings.
export interface IAppSettings {
    filename: string;
    batchAnalysisDelay: IMilliseconds;
    avgHitsPerSecondsDelay: IMilliseconds;
    avgHitsPerSecondsDuration: ISeconds;
    avgHitsPerSecondsThreshold: number;
    renderDelay: IMilliseconds;
}
