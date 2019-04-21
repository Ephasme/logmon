import { LoadReducer } from "./load/reducers";
import { defaultStateFactory, RootState } from "./states";
import { AnyAction } from "./actions";
import { analysisReducer } from "./analysis/reducers";

export type CurrentDateProvider = () => Date;

export interface IStoreManager {
    dispatch(action: AnyAction): void; 
    state: RootState;
}

export class StoreManager implements IStoreManager {
    private currentState = defaultStateFactory();
    private loadReducer: LoadReducer;

    constructor(loadReducer: LoadReducer) {
        this.loadReducer = loadReducer;
    }

    public get state() { return this.currentState; }

    public dispatch(action: AnyAction): void {
        this.currentState = {
            load: this.loadReducer(this.currentState.load, action),
            analysis: analysisReducer(this.currentState.analysis, action),
        };
    }
}
