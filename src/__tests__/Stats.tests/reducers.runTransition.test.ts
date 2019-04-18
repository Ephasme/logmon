import { List } from "immutable";
import * as moment from "moment";
import { defaultAlertState, defaultBatchState } from "../../Stats/defaultStates";
import { reduceAlert } from "../../Stats/reducers";
import { IAlertState, IBatchState, AnyMessage, IAlertMessage, IApplicationSettings } from "../../Stats/types";

const appSettings: () => IApplicationSettings = () => ({
    maxHitsPerSeconds: 10,
    maxOverloadDuration: 20,
    secondsPerRefresh: 5,
    filename: "",
});

it("should increase overloading when hits is too high", () => {
    const state: IAlertState = defaultAlertState();
    const currentBatch: IBatchState = defaultBatchState();
    state.overloadDuration = 2;
    currentBatch.hits = 200;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, appSettings(), now);

    expect(result.overloadDuration).toBe(7);
});

it("should not increase overloading more than threshold", () => {
    const state: IAlertState = defaultAlertState();
    const currentBatch: IBatchState = defaultBatchState();
    state.overloadDuration = 19;
    currentBatch.hits = 200;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, appSettings(), now);

    expect(result.overloadDuration).not.toBeGreaterThan(20);
});

it("should not create a recovering message when hits is zero and no message", () => {
    const state: IAlertState = defaultAlertState();
    const currentBatch: IBatchState = defaultBatchState();
    state.overloadDuration = 15;
    state.message = List();
    currentBatch.hits = 200;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, appSettings(), now);

    expect(result.message.get(0)).not.toContain("Recovered");
});

it("should create a recovering message when hits is zero and is off", () => {
    const state: IAlertState = defaultAlertState();
    const currentBatch: IBatchState = defaultBatchState();
    state.overloadDuration = 1;
    state.message = List();
    state.status = "off";
    currentBatch.hits = 0;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, appSettings(), now);

    expect(result.message.get(0)).toEqual({
        type: "recover",
        time: now,
    });
});

it("should not change message but reduce hits when hits is zero and is on", () => {
    const state: IAlertState = defaultAlertState();
    const currentBatch: IBatchState = defaultBatchState();
    state.overloadDuration = 1;
    state.message = List();
    state.status = "on";
    currentBatch.hits = 0;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, appSettings(), now);

    expect(result.message.size).toBe(0);
    expect(result.overloadDuration).toBe(0);
});

it("should not update the message if its off and overloaded", () => {
    const state: IAlertState = defaultAlertState();
    const currentBatch: IBatchState = defaultBatchState();
    moment
    state.overloadDuration = 3;
    state.status = "off";
    state.message = List<AnyMessage>([ { type: "alert", time: moment().subtract(moment.duration(2, "day")).toDate(), hits: 1524, } ])
    currentBatch.hits = 100;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, appSettings(), now);

    expect(result.message.get(0)).toBe(state.message.get(0));
})

it("should reduce overloading when hits is low", () => {
    const state: IAlertState = defaultAlertState();
    const currentBatch: IBatchState = defaultBatchState();
    state.overloadDuration = 10;
    currentBatch.hits = 0;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, appSettings(), now);

    expect(result.overloadDuration).toBe(5);
});

it("should create a message when hits is too high", () => {
    const state: IAlertState = defaultAlertState();
    const currentBatch: IBatchState = defaultBatchState();
    state.overloadDuration = 19;
    currentBatch.hits = 200;
    const now = new Date();
    const result = reduceAlert(state, currentBatch, appSettings(), now);

    expect(result.message.get(0)).toEqual({
        hits: currentBatch.hits,
        time: now,
        type: "alert",
    });
});
