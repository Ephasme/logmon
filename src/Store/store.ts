import { AnyAction } from "./actions";
import { AnalysisReducer } from "./analysis/reducers";
import { AvgHitsStateReducer } from "./avghits/reducers";
import { RootState } from "./states";

export type CurrentDateProvider = () => Date;

export interface IStoreManager {
    state: RootState;
    dispatch(action: AnyAction): void;
}

export class StoreManager implements IStoreManager {
    private currentState: RootState;
    private analysisReducer: AnalysisReducer;
    private avgHitsStateReducer: AvgHitsStateReducer;

    constructor(initialState: RootState,
                avgHitsStateReducer: AvgHitsStateReducer,
                analysisReducer: AnalysisReducer) {
        this.analysisReducer = analysisReducer;
        this.currentState = initialState;
        this.avgHitsStateReducer = avgHitsStateReducer;
    }

    public get state() { return this.currentState; }

    public dispatch(action: AnyAction): void {
        this.currentState = {
            analysis: this.analysisReducer(this.currentState.analysis, action),
            avgHits: this.avgHitsStateReducer(this.currentState.avgHits, action),
        };
    }
}
