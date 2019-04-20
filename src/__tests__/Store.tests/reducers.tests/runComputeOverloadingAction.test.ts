import { List } from "immutable";
import { computeOverloadingAction } from "../../../Store/actions";
import { runComputeOverloadingAction } from "../../../Store/reducers";
import { defaultStateFactory, AnyStatus, OVERLOADING, RECOVERING, OverloadedStatus as OverloadingStatus, IDLE, RootState, AlertState } from "../../../Store/states";
import { makeLogs } from "../../../__fixtures__/makeLogBatch";

it("should recover when overloading and hits less than threshold", () => {
    let state = defaultStateFactory();
    state = {
        alert: {
            logs: makeLogs(),
            status: { type: OVERLOADING, since: new Date(), hits: 154 }, 
        },
    };

    const now = new Date(2015, 1, 1, 1, 12, 1);
    const result = runComputeOverloadingAction(state.alert, computeOverloadingAction(1, now));
    const expected: AlertState = {
        logs: List(),
        status: { type: RECOVERING, since: new Date(2015, 1, 1, 1, 12, 1) },
    };
    expect(result).toEqual(expected);
});

it("should trim logs when keep overloading", () => {
    let state = defaultStateFactory();
    state = {
        alert: {
            logs: makeLogs(),
            status: { type: OVERLOADING, since: new Date(), hits: 154 }, 
        },
    };

    const now = new Date(2015, 1, 1, 1, 12, 1);
    const result = runComputeOverloadingAction(state.alert, computeOverloadingAction(0.1, now));

    expect(result).toEqual({
        ...state.alert,
        logs: List(),
    });
});

it("should overload when threshold is reached", () => {
    let state = defaultStateFactory();
    state = {
        alert: {
            logs: makeLogs(),
            status: { type: IDLE, since: new Date() }, 
        },
    };

    const now = new Date(2015, 1, 1, 1, 12, 1);
    const result = runComputeOverloadingAction(state.alert, computeOverloadingAction(0.1, now));
    const expected: AlertState = {
        logs: List(),
        status: { type: OVERLOADING, since: new Date(2015, 1, 1, 1, 12, 1), hits: 0.625 },
    };
    expect(result).toEqual(expected);
});

it("should recover when no data and overloading", () => {
    let state = defaultStateFactory();
    
    state = {
        alert: {
            logs: List([]),
            status: { type: OVERLOADING, since: new Date(), hits: 34 },
        },
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state.alert, computeOverloadingAction(10, now));

    expect(result).toEqual({
        logs: List([]),
        status: { type: RECOVERING, since: now },
    });
});
