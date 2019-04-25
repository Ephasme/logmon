import { AnyAction } from "../actions";
import { NEW_LOG } from "../common/actions";
import { AVGHITS_COMPUTE } from "./actions";
import { AvgHitsComputeRunner } from "./runners/runAvgHitsCompute";
import { AvgHitsState } from "./states";

export type AvgHitsStateReducerFactory = (runner: AvgHitsComputeRunner) => AvgHitsStateReducer;
export type AvgHitsStateReducer = (state: AvgHitsState, action: AnyAction) => AvgHitsState;

export const avgHitsReducer: AvgHitsStateReducerFactory = (runner) => (state, action) => {
    switch (action.type) {
        case NEW_LOG: {
            return {...state, logs: state.logs.unshift(action.payload.log) };
        }
        case AVGHITS_COMPUTE: {
            return runner(state, action);
        }
    }
    return state;
};
