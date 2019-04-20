import { AnyAlertAction } from "./alert/actions";
import { alertReducer } from "./alert/reducers";
import { defaultStateFactory } from "./states";

export type CurrentDateProvider = () => Date;

class StoreManager {
    private currentState = defaultStateFactory();

    public get state() { return this.currentState; }

    public dispatch(action: AnyAlertAction) {
        this.currentState = {
            alert: alertReducer(this.currentState.alert, action),
        };
    }
}

export const storage = new StoreManager();
