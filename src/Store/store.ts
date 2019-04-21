import { alertReducer } from "./load/reducers";
import { defaultStateFactory } from "./states";
import { AnyAction } from "./actions";
import { analysisReducer } from "./analysis/reducers";

export type CurrentDateProvider = () => Date;

class StoreManager {
    private currentState = defaultStateFactory();

    public get state() { return this.currentState; }

    public dispatch(action: AnyAction) {
        this.currentState = {
            alert: alertReducer(this.currentState.alert, action),
            analysis: analysisReducer(this.currentState.analysis, action),
        };
    }
}

export const storage = new StoreManager();
