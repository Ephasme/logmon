import { ILogLine } from "../../LogWatcher";

export const ANALYSIS_COMPUTE = "analysis/COMPUTE";

export interface IAnalysisCompute {
    type: typeof ANALYSIS_COMPUTE;
    payload: {
        now: Date,
    };
}

export const computeAnalysis = (now: Date): IAnalysisCompute =>
    ({ type: ANALYSIS_COMPUTE, payload: { now }});
