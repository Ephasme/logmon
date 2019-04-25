import { List, Map } from "immutable";
import { createGui } from "../../GUI/render";
import { IBasicStats } from "../../Store/analysis/utils/createBasicStatsFrom";
import { AnyMessage, AvgHitsState, defaultAvgHitsStateFactory } from "../../Store/avghits/states";
import { defaultStateFactory, RootState } from "../../Store/states";
import { Sec } from "../../Utils/units";

export const createState = (seed: Partial<AvgHitsState>): RootState => {
    const someState: RootState = defaultStateFactory();
    return {
        ...someState,
        avgHits: {
            ...defaultAvgHitsStateFactory(),
            ...seed,
        },
    };
};
export const createSettings = () => ({
    filename: "filename",
    maxHitsPerSeconds: 12,
    maxOverloadDuration: 5,
    secondsPerRefresh: 2,
});

it("should display many messages", () => {
    const result: string[] = [];
    const gui = createGui(jest.fn(), (input) => { result.push(input); });
    gui.render(createState({
        status: "triggered",
        messages: List<AnyMessage>([
            {type: "alert", hits: 15, time: new Date(2015, 1, 2, 4, 1, 3)},
            {type: "info", time: new Date(2015, 1, 2, 5, 1, 3)},
            {type: "alert", hits: 15, time: new Date(2015, 1, 2, 6, 1, 3)},
        ]),
    }), new Date(2015, 1, 1, 1, 12, 51), "filename", 10, Sec(5));
    expect(result.join("\n")).toMatchSnapshot();
});

it("should display an alert message when message is alert", () => {
    const result: string[] = [];
    const gui = createGui(jest.fn(), (input) => { result.push(input); });
    gui.render(createState({
        status: "triggered",
        messages: List([{type: "alert", hits: 15, time: new Date(2015, 1, 2, 4, 1, 3)}]),
    }), new Date(2015, 1, 1, 1, 12, 51), "file", 10, Sec(5));
    expect(result.join("\n")).toMatchSnapshot();
});

it("should display recovering message when message is recovering", () => {
    const result: string[] = [];
    const gui = createGui(jest.fn(), (input) => { result.push(input); });
    gui.render(createState({
        status: "triggered",
        messages: List([{type: "info", time: new Date(2015, 1, 2, 4, 1, 3)}]),
    }), new Date(2015, 1, 1, 1, 12, 51), "file", 10, Sec(5)),
    expect(result.join("\n")).toMatchSnapshot();
});

it("should display sections when filled", () => {
    const result: string[] = [];
    const state: RootState = {
        avgHits: defaultAvgHitsStateFactory(),
        analysis: {
            currentBatch: List([]),
            sections: Map<string, IBasicStats>([
                ["test1", {
                    errors: 12,
                    hits: 8,
                    timespan: Sec(73),
                    traffic: 91,
                }],
                ["test2", {
                    errors: 57,
                    hits: 14,
                    timespan: Sec(74),
                    traffic: 123,
                }],
            ]),
            totalAll: {
                errors: 50,
                hits: 55,
                timespan: Sec(127),
                traffic: 66,
            },
            totalBatch: {
                errors: 76,
                hits: 22,
                timespan: Sec(33),
                traffic: 44,
            },
        },
    };
    const gui = createGui(jest.fn(), (input) => { result.push(input); });
    gui.render(state, new Date(2015, 1, 1, 1, 12, 51), "file", 10, Sec(5));
    expect(result.join("\n")).toMatchSnapshot();
});
