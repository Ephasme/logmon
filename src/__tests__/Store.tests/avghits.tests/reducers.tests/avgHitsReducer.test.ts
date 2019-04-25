import { avgHitsReducer } from "../../../../Store/avghits/reducers";
import { newLog } from "../../../../Store/common/actions";
import { defaultStateFactory } from "../../../../Store/states";
import { generateLogLine } from "../../../../__fixtures__/logLineFactory";

it("should add a log when dispatching NEW_LOG", () => {
    const state = defaultStateFactory();
    const logLine = generateLogLine();
    const result = avgHitsReducer(state.avgHits, newLog(logLine));

    expect(result.logs).toContain(logLine);
});
