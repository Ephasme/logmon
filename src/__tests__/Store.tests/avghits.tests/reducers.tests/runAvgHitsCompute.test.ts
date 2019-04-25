import { List } from "immutable";
import { generateLogLine } from "../../../../__fixtures__/logLineFactory";
import { makeLogs } from "../../../../__fixtures__/makeLogBatch";
import { AVGHITS_COMPUTE } from "../../../../Store/avghits/actions";
import { runAvgHitsCompute } from "../../../../Store/avghits/runners/runAvgHitsCompute";
import { AnyMessage } from "../../../../Store/avghits/states";
import { Ms, Sec } from "../../../../Utils/units";

it("should trim old logs", () => {
    const toKeep = generateLogLine({ time: new Date(2018, 1, 1, 1, 8, 0) });
    const toDiscard = generateLogLine({ time: new Date(2018, 1, 1, 1, 2, 1) });
    const newState = runAvgHitsCompute({
        messages: List(),
        avgHitsPerSeconds: 0,
        status: "idle",
        logs: List([toKeep, toDiscard]),
    }, {
        type: AVGHITS_COMPUTE,
        payload: {
            now: new Date(2018, 1, 1, 1, 8, 2),
            elapsedSinceLastUpdate: Sec(10),
            ttl: Ms(5000),
            avgHitsPerSecondThreshold: 10,
        },
    });
    expect(newState.logs.toArray()).toContain(toKeep);
    expect(newState.logs.toArray()).not.toContain(toDiscard);
});

it("should not add a message when below threshold and was idle", () => {
    const { logs, hitsPerSecond } = makeLogs();
    const now = new Date(2018, 0, 0, 0, 0, 13, 0);
    const newState = runAvgHitsCompute({
        messages: List(),
        avgHitsPerSeconds: 0,
        status: "idle",
        logs,
    }, {
        type: AVGHITS_COMPUTE,
        payload: {
            now,
            elapsedSinceLastUpdate: Sec(10),
            ttl: Ms(5000),
            avgHitsPerSecondThreshold: hitsPerSecond * 2,
        },
    });
    const expected: List<AnyMessage> = List<AnyMessage>();
    expect(newState.messages).toEqual(expected);
});

it("should add a recover message when below threshold and was triggered", () => {
    const { logs, hitsPerSecond } = makeLogs();
    const now = new Date(2018, 0, 0, 0, 0, 13, 0);
    const newState = runAvgHitsCompute({
        messages: List(),
        avgHitsPerSeconds: 0,
        status: "triggered",
        logs,
    }, {
        type: AVGHITS_COMPUTE,
        payload: {
            now,
            elapsedSinceLastUpdate: Sec(10),
            ttl: Ms(5000),
            avgHitsPerSecondThreshold: hitsPerSecond * 2,
        },
    });
    const expected: List<AnyMessage> = List<AnyMessage>([
        { type: "info", time: now },
    ]);
    expect(newState.messages).toEqual(expected);
});

it("should create an alert message when over threshold and was idle", () => {
    const { logs, hitsPerSecond } = makeLogs();
    const now = new Date(2018, 0, 0, 0, 0, 13, 0);
    const newState = runAvgHitsCompute({
        messages: List(),
        avgHitsPerSeconds: 0,
        status: "idle",
        logs,
    }, {
        type: AVGHITS_COMPUTE,
        payload: {
            now,
            elapsedSinceLastUpdate: Sec(10),
            ttl: Ms(5000),
            avgHitsPerSecondThreshold: hitsPerSecond / 2,
        },
    });
    const expected: List<AnyMessage> = List<AnyMessage>([
        { type: "alert", time: now, hits: hitsPerSecond },
    ]);
    expect(newState.messages).toEqual(expected);
});

it("should not create an alert message when over threshold and was triggered", () => {
    const { logs, hitsPerSecond } = makeLogs();
    const now = new Date(2018, 0, 0, 0, 0, 13, 0);
    const newState = runAvgHitsCompute({
        messages: List(),
        avgHitsPerSeconds: 0,
        status: "triggered",
        logs,
    }, {
        type: AVGHITS_COMPUTE,
        payload: {
            now,
            elapsedSinceLastUpdate: Sec(10),
            ttl: Ms(5000),
            avgHitsPerSecondThreshold: hitsPerSecond / 2,
        },
    });
    const expected: List<AnyMessage> = List<AnyMessage>();
    expect(newState.messages).toEqual(expected);
});

it("should trigger when over threshold", () => {
    const { logs, hitsPerSecond } = makeLogs();
    const newState = runAvgHitsCompute({
        messages: List(),
        avgHitsPerSeconds: 0,
        status: "idle",
        logs,
    }, {
        type: AVGHITS_COMPUTE,
        payload: {
            now: new Date(2018, 0, 0, 0, 0, 13, 0),
            elapsedSinceLastUpdate: Sec(10),
            ttl: Ms(5000),
            avgHitsPerSecondThreshold: hitsPerSecond / 2,
        },
    });
    expect(newState.status).toBe("triggered");
});

it("should compute correct avg", () => {
    const { logs, hitsPerSecond } = makeLogs();
    const newState = runAvgHitsCompute({
        messages: List(),
        avgHitsPerSeconds: 0,
        status: "idle",
        logs,
    }, {
        type: AVGHITS_COMPUTE,
        payload: {
            now: new Date(2018, 0, 0, 0, 0, 13, 0),
            elapsedSinceLastUpdate: Sec(10),
            ttl: Ms(5000),
            avgHitsPerSecondThreshold: hitsPerSecond * 2,
        },
    });
    expect(newState.logs.toArray()).toHaveLength(4);
    expect(newState.avgHitsPerSeconds).toEqual(4 / 3);
});
