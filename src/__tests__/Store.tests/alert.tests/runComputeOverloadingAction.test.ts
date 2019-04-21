import { List } from "immutable";
import { computeOverloading } from "../../../Store/alert/actions";
import { runComputeOverloadingAction } from "../../../Store/alert/reducers";
import { OVERLOADING, RECOVERING, IDLE, AlertState } from "../../../Store/alert/states";
import { makeLogs } from "../../../__fixtures__/makeLogBatch";

it("should recover when overloading and hits less than threshold", () => {
    const state: AlertState = {
        logs: makeLogs(),
        status: { type: OVERLOADING, since: new Date(), hits: 154 }, 
    };

    const now = new Date(2015, 1, 1, 1, 12, 1);
    const result = runComputeOverloadingAction(state, computeOverloading(1, now));
    const expected: AlertState = {
        logs: List(),
        status: { type: RECOVERING, since: new Date(2015, 1, 1, 1, 12, 1) },
    };
    expect(result).toEqual(expected);
});

it("should trim logs when keep overloading", () => {
    const state : AlertState = {
        logs: makeLogs(),
        status: { type: OVERLOADING, since: new Date(), hits: 154 },
    };

    const now = new Date(2015, 1, 1, 1, 12, 1);
    const result = runComputeOverloadingAction(state, computeOverloading(0.1, now));

    expect(result).toEqual({
        ...state,
        logs: List(),
    });
});

it("should overload when threshold is reached", () => {
    const state: AlertState = {
        logs: makeLogs(),
        status: { type: IDLE, since: new Date() }, 
    };

    const now = new Date(2015, 1, 1, 1, 12, 1);
    const result = runComputeOverloadingAction(state, computeOverloading(0.1, now));
    const expected: AlertState = {
        logs: List(),
        status: { type: OVERLOADING, since: new Date(2015, 1, 1, 1, 12, 1), hits: 0.625 },
    };
    expect(result).toEqual(expected);
});

it("should recover when no data and overloading", () => {
    const state: AlertState = {
        logs: List([]),
        status: { type: OVERLOADING, since: new Date(), hits: 34 },
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, computeOverloading(10, now));

    expect(result).toEqual({
        logs: List([]),
        status: { type: RECOVERING, since: now },
    });
});
