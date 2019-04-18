import { IState } from "../Stats/types";
import { defaultState } from "../Stats/defaultStates";
import { List } from "immutable";
import { createGui } from "../GUI/render";

export async function test_alert_is_off() {
    const someState: IState = defaultState();

    const newState: IState = {
        ...someState,
        alert: {
            message: List([{ type: "alert", time: new Date(), hits: 120 }]),
            overloadDuration: 120,
            status: "off",
        }
    };
    
    const gui = createGui();
    
    gui.render(newState, {
        filename: "filename",
        maxHitsPerSeconds: 12,
        maxOverloadDuration: 5,
        secondsPerRefresh: 2,
    });
}

export function test_alert_is_on() {
    const someState: IState = defaultState();

    const newState: IState = {
        ...someState,
        alert: {
            message: List([{ type: "recover", time: new Date() }]),
            overloadDuration: 0,
            status: "on",
        }
    };

    const gui = createGui();

    gui.render(newState, {
        filename: "filename",
        maxHitsPerSeconds: 12,
        maxOverloadDuration: 5,
        secondsPerRefresh: 2,
    });
}

new Promise((resolve) => {
    setTimeout(resolve, 500);
}).then(() => {
    test_alert_is_off();
    return new Promise((resolve) => {
        setTimeout(resolve, 500);
    });
}).then(() => {
    test_alert_is_on();
    return new Promise((resolve) => {
        setTimeout(resolve, 500);
    });
}).then(() => {
    console.log("done");
});



