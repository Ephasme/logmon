import { AnyAction } from "../actions";
import { AnalysisState } from "./states";
import { COMPUTE_ANALYSIS } from "./actions";
import { NEW_LOG } from "../common/actions";
import { List } from "immutable";
import { groupLogLinesBySections } from "./utils/groupLogLinesBySections";
import { createBasicStatsFrom, IBasicStats } from "./utils/createBasicStatsFrom";
import { Sec } from "../../Utils/units";

export type AnalysisReducer = (state: AnalysisState, action: AnyAction) => AnalysisState;

export type Adder<T> = (state1: T, state2: T) => T;

export type BasicStatsAdder = Adder<IBasicStats>;

export const add: BasicStatsAdder = (state1, state2) => ({
    errors: state2.errors + state1.errors,
    hits: state2.hits + state1.hits,
    traffic: state2.traffic + state1.traffic,
    timespan: Sec(state2.timespan.sec + state1.timespan.sec),
});

export const analysisReducer: AnalysisReducer = (state, action) => {

    switch (action.type) {
        case NEW_LOG: {
            return {
                ...state,
                currentBatch: state.currentBatch.unshift(action.payload.log),
            }
        }
        case COMPUTE_ANALYSIS: {
            const totalBatch = createBasicStatsFrom(state.currentBatch);
            const sections = groupLogLinesBySections(state.currentBatch).map(x => createBasicStatsFrom(x.toList()));

            return {
                totalAll: add(totalBatch, state.totalAll),
                totalBatch,
                sections,
                currentBatch: List(),
            }
        }
    }
    return state;
}