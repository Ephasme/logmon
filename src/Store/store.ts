import { dataReducer, logsReducer } from "./reducers";
import { defaultStateFactory } from "./states";
import { AnyAction } from "./actions";

class StoreManager {
    private currentState = defaultStateFactory();

    public get state() { return this.currentState; }

    public dispatch(action: AnyAction) {
        this.currentState = {
            data: dataReducer(this.currentState, action),
            logs: logsReducer(this.currentState.logs, action),
        };
    }
}

export const storage = new StoreManager();