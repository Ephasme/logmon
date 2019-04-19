import { IState, IAlertState, IBasicState } from "../../Stats/types";
import { defaultState, defaultAlertState } from "../../Stats/defaultStates";
import { List, Map } from "immutable";
import { createGui } from "../../GUI/render";

export const createAlertState = (alert: IAlertState): IState => {
    const someState: IState = defaultState();
    return {
        ...someState,
        alert,
    };
}
export const createSettings = () => ({
    filename: "filename",
    maxHitsPerSeconds: 12,
    maxOverloadDuration: 5,
    secondsPerRefresh: 2,
});

it("should display an alert when alert is off", () => {
    const result: string[] = [];
    const gui = createGui(jest.fn(), input => { result.push(input); });
    gui.render(createAlertState({
        message: List([{ type: "alert", time: new Date(1985, 3, 4, 5, 12, 5, 124), hits: 120 }]),
        overloadDuration: 120,
        status: "off",
    }),
        createSettings(),
        new Date(1985, 3, 4, 5, 12, 20, 124),
        new Date(1985, 3, 4, 5, 12, 10, 124));
    expect(result.join("\n")).toMatchSnapshot();
});

it("should not display an alert when alert is on", () => {
    const result: string[] = [];
    const gui = createGui(jest.fn(), input => { result.push(input); });
    gui.render(createAlertState({
        message: List([{ type: "recover", time: new Date(1985, 3, 4, 5, 12, 5, 124) }]),
        overloadDuration: 0,
        status: "on",
    }),
        createSettings(),
        new Date(1985, 3, 4, 5, 12, 20, 124),
        new Date(1985, 3, 4, 5, 12, 10, 124));
    expect(result.join("\n")).toMatchSnapshot();
});

it("should display an recover message when alert is off but overload is zero", () => {
    const result: string[] = [];
    const gui = createGui(jest.fn(), input => { result.push(input); });
    gui.render(createAlertState({
        message: List([{ type: "recover", time: new Date(1985, 3, 4, 5, 12, 5, 124) }]),
        overloadDuration: 0,
        status: "off",
    }),
        createSettings(),
        new Date(1985, 3, 4, 5, 12, 20, 124),
        new Date(1985, 3, 4, 5, 12, 10, 124));
    expect(result.join("\n")).toMatchSnapshot();
});

it("should display sections when filled", () => {
    const result: string[] = [];
    const state: IState = {
        alert: defaultAlertState(),
        allBatches: {
            errors: 1,
            hits: 2,
            sections: Map<string, IBasicState>([
                ["section1", {
                    errors: 3,
                    hits: 4,
                    traffic: 5,
                }],
                ["section2", {
                    errors: 6,
                    hits: 7,
                    traffic: 8,
                }],
            ]),
            traffic: 9,
        },
        currentBatch: {
            errors: 10,
            hits: 11,
            sections: Map<string, IBasicState>([
                ["section1", {
                    errors: 12,
                    hits: 13,
                    traffic: 14,
                }],
                ["section2", {
                    errors: 15,
                    hits: 16,
                    traffic: 17,
                }],
            ]),
            traffic: 18,
        },
        hasChanged: true,
        lastValidBatch: {
            errors: 19,
            hits: 20,
            sections: Map<string, IBasicState>([
                ["section1", {
                    errors: 21,
                    hits: 22,
                    traffic: 23,
                }],
                ["section2", {
                    errors: 24,
                    hits: 25,
                    traffic: 26,
                }],
            ]),
            traffic: 1137,
        },
    }
    const gui = createGui(jest.fn(), input => { result.push(input); });
    gui.render(state, createSettings(),
        new Date(1985, 3, 4, 5, 12, 20, 124),
        new Date(1985, 3, 4, 5, 12, 10, 124));
    expect(result.join("\n")).toMatchSnapshot();
});
