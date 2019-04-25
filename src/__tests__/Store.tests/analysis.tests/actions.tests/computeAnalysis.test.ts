import { ANALYSIS_COMPUTE, computeAnalysis, IAnalysisCompute } from "../../../../Store/analysis/actions";

it("should create an action with good parameters", () => {
    const date = new Date();
    const result = computeAnalysis(date);
    const expected: IAnalysisCompute = {
        type: ANALYSIS_COMPUTE,
        payload: {
            now: date,
        },
    };
    expect(result).toEqual(expected);
});
