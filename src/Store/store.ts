import { AnyAction } from "./actions";
import { alertReducer } from "./reducers";
import { defaultStateFactory } from "./states";

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
