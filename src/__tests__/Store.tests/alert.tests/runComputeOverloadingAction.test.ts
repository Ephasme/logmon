import { LoadState, defaultLoadStateFactory } from "../../../Store/load/states";
import { runComputeOverloadingAction } from "../../../Store/load/reducers";
import { makeLogs } from "../../../__fixtures__/makeLogBatch";
import { List } from "immutable";

it("should increase overloading when hits is too high", () => {
    let state: LoadState = defaultLoadStateFactory();
    const fixture = makeLogs();
    state = {
        ...state,
        logs: fixture.logs, 
        overloadDuration: 0,
    };
    const now = new Date();
    const result = runComputeOverloadingAction(state, {
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: 8,
            hitsPerSecondThreshold: fixture.hitsPerSecond / 2,
            maxOverloadDuration: 20,
            now,
        }
    });
    expect(result.overloadDuration).toEqual(8);
    expect(Array.from(result.logs)).toHaveLength(0);
})

it("should not increase overloading more than threshold", () => {
    let state: LoadState = defaultLoadStateFactory();
    const fixture = makeLogs();
    state = {
        ...state,
        logs: fixture.logs,
        overloadDuration: 19,
    };
    const now = new Date();
    const result = runComputeOverloadingAction(state, { 
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: 8,
            hitsPerSecondThreshold: fixture.hitsPerSecond / 2,
            maxOverloadDuration: 20,
            now,
        }
    });

    expect(result.overloadDuration).not.toBeGreaterThan(20);
});

it("should not decrease overloading less than 0", () => {
    let state: LoadState = defaultLoadStateFactory();
    const fixture = makeLogs();
    state = {
        ...state,
        logs: fixture.logs,
        overloadDuration: 5,
    };
    const now = new Date();
    const result = runComputeOverloadingAction(state, { 
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: 0,
            hitsPerSecondThreshold: fixture.hitsPerSecond / 2,
            maxOverloadDuration: 20,
            now,
        }
    });

    expect(result.overloadDuration).not.toBeLessThan(0);
});

it("should decrease overloading when no data but time passed", () => {
    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: List(),
        status: "TRIGGERED",
        overloadDuration: 15,
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, { 
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: 5,
            hitsPerSecondThreshold: 0,
            maxOverloadDuration: 20,
            now,
        }
    });

    expect(result.overloadDuration).toEqual(10);
});

it("should preferably use real log time gap instead of process time", () => {

    const fixture = makeLogs();

    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: fixture.logs,
        status: "TRIGGERED",
        overloadDuration: 15,
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, { 
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: 5,
            hitsPerSecondThreshold: fixture.hitsPerSecond + 1,
            maxOverloadDuration: 20,
            now,
        }
    });

    expect(result.overloadDuration).toEqual(15 - fixture.elapsed);
});

it("should create a recovering message when triggered and recovered", () => {
    const fixture = makeLogs();

    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: fixture.logs,
        status: "TRIGGERED",
        overloadDuration: fixture.elapsed,
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, { 
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: 0,
            hitsPerSecondThreshold: fixture.hitsPerSecond + 1,
            maxOverloadDuration: 20,
            now,
        }
    });

    expect(result.message).toEqual({
        type: "info",
        time: now,
    })
});

it("should create am overloaded message when not triggered and overloaded", () => {
    const fixture = makeLogs();

    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: fixture.logs,
        status: "IDLE",
        overloadDuration: 5,
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, { 
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: 0,
            hitsPerSecondThreshold: fixture.hitsPerSecond / 2,
            maxOverloadDuration: fixture.elapsed,
            now,
        }
    });

    expect(result.message).toEqual({
        type: "alert",
        hits: fixture.hitsPerSecond,
        time: now,
    })
});

it("should should not change message when idle and recovered", () => {
    const fixture = makeLogs();

    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: fixture.logs,
        status: "IDLE",
        message: { type: "info", time: new Date() },
        overloadDuration: fixture.elapsed,
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, { 
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: 0,
            hitsPerSecondThreshold: fixture.hitsPerSecond + 1,
            maxOverloadDuration: 20,
            now,
        }
    });

    expect(result.message).toEqual(state.message)
});

it("should should not change message when triggered and overloaded", () => {
    const fixture = makeLogs();

    let state: LoadState = defaultLoadStateFactory();
    state = {
        ...state,
        logs: fixture.logs,
        status: "IDLE",
        message: { type: "info", time: new Date() },
        overloadDuration: fixture.elapsed,
    };

    const now = new Date();
    const result = runComputeOverloadingAction(state, { 
        type: "alert/UPDATE_LOAD",
        payload: {
            elapsedSinceLastUpdate: 0,
            hitsPerSecondThreshold: fixture.hitsPerSecond + 1,
            maxOverloadDuration: 20,
            now,
        }
    });

    expect(result.message).toEqual(state.message)
});
