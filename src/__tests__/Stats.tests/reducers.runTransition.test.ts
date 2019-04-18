import { List } from "immutable";
import { defaultAlertState, defaultBatchState } from "../../Stats/defaultStates";
import { reduceAlert } from "../../Stats/reducers";
import { IAlertState, IBatchState } from "../../Stats/types";

it("should increase overloading when hits is too high", () => {
    const state: IAlertState = defaultAlertState;
    const currentBatch: IBatchState = defaultBatchState;
    state.overload = 2;
    currentBatch.hits = 200;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, now, 10, 3);

    expect(result.overload).toBe(3);
});

it("should not increase overloading more than threshold", () => {
    const state: IAlertState = defaultAlertState;
    const currentBatch: IBatchState = defaultBatchState;
    state.overload = 3;
    currentBatch.hits = 200;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, now, 10, 3);

    expect(result.overload).not.toBeGreaterThan(3);
});

it("should not create a recovering message when hits is zero and no message", () => {
    const state: IAlertState = defaultAlertState;
    const currentBatch: IBatchState = defaultBatchState;
    state.overload = 2;
    state.message = List();
    currentBatch.hits = 200;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, now, 10, 3);

    expect(result.message.get(0)).not.toContain("Recovered");
});

it("should create a recovering message when hits is zero and is off", () => {
    const state: IAlertState = defaultAlertState;
    const currentBatch: IBatchState = defaultBatchState;
    state.overload = 1;
    state.message = List();
    state.status = "off";
    currentBatch.hits = 0;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, now, 10, 3);

    expect(result.message.get(0)).toEqual({
        type: "recover",
        time: now,
    });
});

it("should not change message but reduce hits when hits is zero and is on", () => {
    const state: IAlertState = defaultAlertState;
    const currentBatch: IBatchState = defaultBatchState;
    state.overload = 1;
    state.message = List();
    state.status = "on";
    currentBatch.hits = 0;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, now, 10, 3);

    expect(result.message.size).toBe(0);
    expect(result.overload).toBe(0);
});

it("should reduce overloading when hits is low", () => {
    const state: IAlertState = defaultAlertState;
    const currentBatch: IBatchState = defaultBatchState;
    state.overload = 3;
    currentBatch.hits = 0;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, now, 10, 3);

    expect(result.overload).toBe(2);
});

it("should create a message when hits is too high", () => {
    const state: IAlertState = defaultAlertState;
    const currentBatch: IBatchState = defaultBatchState;
    state.overload = 2;
    currentBatch.hits = 200;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, now, 10, 3);

    expect(result.message.size).not.toBe(0);
    expect(result.message.get(0)).toEqual({
        hits: currentBatch.hits,
        time: now,
        type: "alert",
    });
});
