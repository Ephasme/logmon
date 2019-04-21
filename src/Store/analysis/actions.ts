export const START_ANALYSIS = "analysis/START_ANALYSIS";
export interface IStartAnalysis {
    type: typeof START_ANALYSIS;
    payload: { };
}

export const startAnalysis = (): IStartAnalysis =>
    ({ type: START_ANALYSIS, payload: { }});