import { alertReducer } from "./load/reducers";
import { defaultStateFactory } from "./states";
import { AnyAction } from "./actions";

export type CurrentDateProvider = () => Date;

class StoreManager {
    private currentState = defaultStateFactory();

    public get state() { return this.currentState; }

    public dispatch(action: AnyAction) {
        this.currentState = {
            alert: alertReducer(this.currentState.alert, action),
        };
    }
}

export const storage = new StoreManager();
