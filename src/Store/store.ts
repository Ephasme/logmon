import { AnyAction } from "./actions";
import { AnalysisReducer } from "./analysis/reducers";
import { LoadReducer } from "./load/reducers";
import { defaultStateFactory, RootState } from "./states";

export type CurrentDateProvider = () => Date;

export interface IStoreManager {
    state: RootState;
    dispatch(action: AnyAction): void;
}

export class StoreManager implements IStoreManager {
    private currentState = defaultStateFactory();
    private loadReducer: LoadReducer;
    private analysisReducer: AnalysisReducer;

    constructor(loadReducer: LoadReducer,
                analysisReducer: AnalysisReducer) {
        this.loadReducer = loadReducer;
        this.analysisReducer = analysisReducer;
    }

    public get state() { return this.currentState; }

    public dispatch(action: AnyAction): void {
        this.currentState = {
            load: this.loadReducer(this.currentState.load, action),
            analysis: this.analysisReducer(this.currentState.analysis, action),
        };
    }
}
