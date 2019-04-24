import { COMPUTE_ANALYSIS, computeAnalysis, IComputeAnalysis } from "../../../../Store/analysis/actions";

it("should create an action with good parameters", () => {
    const date = new Date();
    const result = computeAnalysis(date);
    const expected: IComputeAnalysis = {
        type: COMPUTE_ANALYSIS,
        payload: {
            now: date,
        },
    };
    expect(result).toEqual(expected);
});