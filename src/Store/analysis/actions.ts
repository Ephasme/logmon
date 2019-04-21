export const COMPUTE_ANALYSIS = "analysis/COMPUTE";
export interface IComputeAnalysis {
    type: typeof COMPUTE_ANALYSIS;
    payload: {
        now: Date,
    };
}

export const computeAnalysis = (now: Date): IComputeAnalysis =>
    ({ type: COMPUTE_ANALYSIS, payload: { now }});