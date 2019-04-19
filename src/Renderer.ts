import { defaultState } from "./Stats/defaultStates";
import { MainReducer } from "./Stats/reducers";
import { IGui } from "./GUI/render";
import { ILogLine } from "./Models/ILogLine";
import { IApplicationSettings } from "./Stats/types";

export class Renderer {
    private currentState = defaultState();
    private now = new Date();
    private lastRender = new Date();
    private mainReducer: MainReducer;
    private gui: IGui;
    private appSettings: IApplicationSettings;

    constructor(mainReducer: MainReducer, gui: IGui, appSettings: IApplicationSettings) {
        this.mainReducer = mainReducer;
        this.appSettings = appSettings;
        this.gui = gui;
    }

    public onBatch(logs: ILogLine[]) {
        const { currentState, now, lastRender, appSettings } = this;
        this.currentState = this.mainReducer(currentState, logs, appSettings, new Date());
        this.gui.render(currentState, appSettings, now, lastRender);
        this.lastRender = now;
        this.now = new Date();
    }
}