import { List } from "immutable";
import { generateLogLine } from "../../../../__fixtures__/logLineFactory";
import { computeAnalysis } from "../../../../Store/analysis/actions";
import { computeAvgHits } from "../../../../Store/avghits/actions";
import { avgHitsReducer } from "../../../../Store/avghits/reducers";
import { AvgHitsState } from "../../../../Store/avghits/states";
import { newLog } from "../../../../Store/common/actions";
import { defaultStateFactory } from "../../../../Store/states";
import { Ms, Sec } from "../../../../Utils/units";

it("should add a log when dispatching NEW_LOG", () => {
    const state = defaultStateFactory();
    const logLine = generateLogLine();
    const fakeCompute = jest.fn();
    const result = avgHitsReducer(fakeCompute)(state.avgHits, newLog(logLine));

    expect(result.logs).toContain(logLine);
});

it("should do nothing when action is not used", () => {
    const state = defaultStateFactory();
    const fakeCompute = jest.fn();
    const result = avgHitsReducer(fakeCompute)(state.avgHits, computeAnalysis(new Date()));

    expect(result).toBe(state.avgHits);
});

it("should run avgHitsCompute", () => {
    const state = defaultStateFactory();
    const fakeCompute = jest.fn();
    const action = computeAvgHits(new Date(), Ms(5), Sec(8), 75);
    const result = avgHitsReducer(fakeCompute)(state.avgHits, action);
    const expected: AvgHitsState = {
        avgHitsPerSeconds: 0,
        logs: List(),
        messages: List(),
        status: "idle",
    };
    expect(fakeCompute).toBeCalledWith(expected, action);
});
