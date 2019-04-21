import { List } from "immutable";
import { makeLogs } from "../../../__fixtures__/makeLogBatch";
import { runComputeOverloadingAction } from "../../../Store/load/reducers";
import { defaultLoadStateFactory, LoadState } from "../../../Store/load/states";
import { Sec } from "../../../Utils/units";

it("should increase overloading when hits is too high", () => {
    let state: LoadState = defaultLoadStateFactory();
    const fixture = makeLogs();
    state = {
        ...state,
        logs: fixture.logs,
        overloadDuration: Sec(0),
    };
    const now = new Date();
    const result = runComputeOverloadingAction(state, {
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: Sec(8),
            hitsPerSecondThreshold: fixture.hitsPerSecond / 2,
            maxOverloadDuration: Sec(20),
            now,
        },
    });
    expect(result.overloadDuration.sec).toEqual(8);
    expect(Array.from(result.logs)).toHaveLength(0);
});

it("should not increase overloading more than threshold", () => {
    let state: LoadState = defaultLoadStateFactory();
    const fixture = makeLogs();
    state = {
        ...state,
        logs: fixture.logs,
        overloadDuration: Sec(19),
    };
    const now = new Date();
    const result = runComputeOverloadingAction(state, {
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: Sec(8),
            hitsPerSecondThreshold: fixture.hitsPerSecond / 2,
            maxOverloadDuration: Sec(20),
            now,
        },
    });

    expect(result.overloadDuration.sec).not.toBeGreaterThan(20);
});

it("should not decrease overloading less than 0", () => {
    let state: LoadState = defaultLoadStateFactory();
    const fixture = makeLogs();
    state = {
        ...state,
        logs: fixture.logs,
        overloadDuration: Sec(5),
    };
    const now = new Date();
    const result = runComputeOverloadingAction(state, {
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: Sec(0),
            hitsPerSecondThreshold: fixture.hitsPerSecond / 2,
            maxOverloadDuration: Sec(20),
            now,
        },
    });

    expect(result.overloadDuration.sec).not.toBeLessThan(0);
});

it("should decrease overloading when no data but time passed", () => {
    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: List(),
        status: "TRIGGERED",
        overloadDuration: Sec(15),
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, {
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: Sec(5),
            hitsPerSecondThreshold: 0.1,
            maxOverloadDuration: Sec(20),
            now,
        },
    });

    expect(result.overloadDuration.sec).toEqual(10);
});

it("should preferably use real log time gap instead of process time", () => {

    const fixture = makeLogs();

    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: fixture.logs,
        status: "TRIGGERED",
        overloadDuration: Sec(15),
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, {
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: Sec(5),
            hitsPerSecondThreshold: fixture.hitsPerSecond + 1,
            maxOverloadDuration: Sec(20),
            now,
        },
    });

    expect(result.overloadDuration.sec).toEqual(15 - fixture.elapsed);
});

it("should create a recovering message when triggered and recovered", () => {
    const fixture = makeLogs();

    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: fixture.logs,
        status: "TRIGGERED",
        overloadDuration: Sec(fixture.elapsed),
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, {
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: Sec(0),
            hitsPerSecondThreshold: fixture.hitsPerSecond + 1,
            maxOverloadDuration: Sec(20),
            now,
        },
    });

    expect(result.messages.get(0)).toEqual({
        type: "info",
        time: now,
    });
});

it("should create am overloaded message when not triggered and overloaded", () => {
    const fixture = makeLogs();

    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: fixture.logs,
        status: "IDLE",
        overloadDuration: Sec(5),
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, {
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: Sec(0),
            hitsPerSecondThreshold: fixture.hitsPerSecond / 2,
            maxOverloadDuration: Sec(fixture.elapsed),
            now,
        },
    });

    expect(result.messages.get(0)).toEqual({
        type: "alert",
        hits: fixture.hitsPerSecond,
        time: now,
    });
});

it("should should not change message when idle and recovered", () => {
    const fixture = makeLogs();

    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: fixture.logs,
        status: "IDLE",
        messages: List([{ type: "info", time: new Date() }]),
        overloadDuration: Sec(fixture.elapsed),
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, {
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: Sec(0),
            hitsPerSecondThreshold: fixture.hitsPerSecond + 1,
            maxOverloadDuration: Sec(20),
            now,
        },
    });

    expect(result.messages).toEqual(state.messages);
});

it("should should not change message when triggered and overloaded", () => {
    const fixture = makeLogs();

    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: fixture.logs,
        status: "IDLE",
        messages: List([{ type: "info", time: new Date() }]),
        overloadDuration: Sec(fixture.elapsed),
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, {
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: Sec(0),
            hitsPerSecondThreshold: fixture.hitsPerSecond + 1,
            maxOverloadDuration: Sec(20),
            now,
        },
    });

    expect(result.messages).toEqual(state.messages);
});
