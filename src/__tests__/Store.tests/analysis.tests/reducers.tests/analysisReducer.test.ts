import { Map } from "immutable";
import { generateLogLine } from "../../../../__fixtures__/logLineFactory";
import { ANALYSIS_COMPUTE } from "../../../../Store/analysis/actions";
import { analysisReducer } from "../../../../Store/analysis/reducers";
import { newLog } from "../../../../Store/common/actions";
import { defaultStateFactory } from "../../../../Store/states";
import { Sec } from "../../../../Utils/units";

it("should add a log when dispatching NEW_LOG", () => {
    const state = defaultStateFactory();
    const logLine = generateLogLine();
    const createStats = jest.fn();
    const groupBy = jest.fn();
    const reducer = analysisReducer(createStats, groupBy);
    const result = reducer(state.analysis, newLog(logLine));

    expect(result.currentBatch).toContain(logLine);
});

it("should compute analysis when dispatching COMPUTE_ANALYSIS", () => {
    const state = defaultStateFactory();
    const createStats = jest.fn().mockReturnValue({
        errors: 5,
        hits: 12,
        timespan: Sec(2),
        traffic: 124,
    });
    const expectedSections = Map([
        ["sec1", { errors: 4, hits: 1, timespan: Sec(74), traffic: 123 }],
        ["sec2", { errors: 5, hits: 2, timespan: Sec(75), traffic: 124 }],
        ["sec3", { errors: 6, hits: 3, timespan: Sec(76), traffic: 125 }],
        ["sec4", { errors: 7, hits: 4, timespan: Sec(77), traffic: 126 }],
        ["sec5", { errors: 8, hits: 5, timespan: Sec(78), traffic: 127 }],
    ]);
    const groupBy = jest.fn().mockImplementation(() => ({
        map: () => expectedSections,
    }));
    const reducer = analysisReducer(createStats, groupBy);
    const result = reducer(state.analysis, {
        type: ANALYSIS_COMPUTE,
        payload: {
            now: new Date(),
        },
    });
    expect(result.sections).toEqual(expectedSections);
});
