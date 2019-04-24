import { List } from "immutable";
import { Sec } from "../../Utils/units";
import { AnyAction } from "../actions";
import { NEW_LOG } from "../common/actions";
import { COMPUTE_ANALYSIS } from "./actions";
import { IAnalysisState } from "./states";
import { CreateBasicStatsFrom as CreateStats, IBasicStats } from "./utils/createBasicStatsFrom";
import { GroupLogLinesBySections as GroupBySections } from "./utils/groupLogLinesBySections";

export type AnalysisReducer = (state: IAnalysisState, action: AnyAction) => IAnalysisState;

export type Adder<T> = (state1: T, state2: T) => T;

export type BasicStatsAdder = Adder<IBasicStats>;

export const add: BasicStatsAdder = (state1, state2) => ({
    errors: state2.errors + state1.errors,
    hits: state2.hits + state1.hits,
    traffic: state2.traffic + state1.traffic,
    timespan: Sec(state2.timespan.sec + state1.timespan.sec),
});

export type AnalysisReducerFactory =
    (createStats: CreateStats, groupBySections: GroupBySections) => AnalysisReducer;

export const analysisReducer: AnalysisReducerFactory =
    (createStats, groupLogLinesBySections) => (state, action) => {
    switch (action.type) {
        case NEW_LOG: {
            return {
                ...state,
                currentBatch: state.currentBatch.unshift(action.payload.log),
            };
        }
        case COMPUTE_ANALYSIS: {
            const totalBatch = createStats(state.currentBatch);
            const sections = groupLogLinesBySections(state.currentBatch).map((x) => createStats(x.toList()));

            return {
                totalAll: add(totalBatch, state.totalAll),
                totalBatch,
                sections,
                currentBatch: List(),
            };
        }
    }
    return state;
};
