import { List } from "immutable";
import { generateLogLine } from "../../../__fixtures__/logLineFactory";
import { computeOverloadingAction } from "../../../Store/actions";
import { runComputeOverloadingAction } from "../../../Store/reducers";
import { defaultStateFactory } from "../../../Store/states";

const makeLogs = () => List([
    generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 58) }),
    generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 56) }),
    generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 55) }),
    generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 51) }),
    generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 50) }),
]);

it("should do nothing when no data is given", () => {
    let state = defaultStateFactory();
    state = {
        logs: List([]),
        data: {
             overloadingStatus: "IDLE",
             message: { type: "alert", time: new Date(), hits: 34 },
             currentHitsPerSeconds: 3,
             timespan: 7,
        },
    };

    const result = runComputeOverloadingAction(state, computeOverloadingAction(5, 1));

    expect(result).toEqual(state.data);
});

it("should inform recover when back from overloading", () => {
    let state = defaultStateFactory();
    state = {
        logs: makeLogs(),
        data: {
             overloadingStatus: "TRIGGERED",
             message: { type: "alert", time: new Date(), hits: 34 },
             currentHitsPerSeconds: 24,
             timespan: 10,
        },
    };

    const result = runComputeOverloadingAction(state, computeOverloadingAction(5, 1));

    expect(result).toEqual({
        overloadingStatus: "IDLE",
        message: { type: "recover", time: state.logs.last(null)!.time, hits: 34 },
        currentHitsPerSeconds: 0.625,
        timespan: 5,
    });
});

it("should not raise an alert when alert is already raised", () => {

    let state = defaultStateFactory();
    state = {
        ...state,
        logs: makeLogs(),
    };

    const result = runComputeOverloadingAction(state, computeOverloadingAction(5, 0.1));

    expect(result.message && result.message.type === "alert").toBeTruthy();
    expect(result.currentHitsPerSeconds).toBe(0.625);
    expect(result.overloadingStatus === "TRIGGERED").toBeTruthy();
    expect(result.timespan).toBe(5);
});

it("should raise an alert when overloaded", () => {

    let state = defaultStateFactory();
    state = {
        ...state,
        logs: makeLogs(),
    };

    const result = runComputeOverloadingAction(state, computeOverloadingAction(5, 0.1));

    expect(result.message && result.message.type === "alert").toBeTruthy();
    expect(result.currentHitsPerSeconds).toBe(0.625);
    expect(result.overloadingStatus === "TRIGGERED").toBeTruthy();
    expect(result.timespan).toBe(5);
});
