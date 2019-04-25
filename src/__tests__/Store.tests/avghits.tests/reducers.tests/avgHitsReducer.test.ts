import { generateLogLine } from "../../../../__fixtures__/logLineFactory";
import { avgHitsReducer } from "../../../../Store/avghits/reducers";
import { newLog } from "../../../../Store/common/actions";
import { defaultStateFactory } from "../../../../Store/states";
import { computeAnalysis } from "../../../../Store/analysis/actions";

it("should add a log when dispatching NEW_LOG", () => {
    const state = defaultStateFactory();
    const logLine = generateLogLine();
    const result = avgHitsReducer(state.avgHits, newLog(logLine));

    expect(result.logs).toContain(logLine);
});

it("should do nothing when action is not used", () => {
    const state = defaultStateFactory();
    const result = avgHitsReducer(state.avgHits, computeAnalysis(new Date()));

    expect(result).toBe(state.avgHits);
});

it("should run avgHitsCompute", () => {
    jest.mock("../../../../Store/avghits/reducers");

    fail("not implemented");
});
