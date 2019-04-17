import { IState } from "../../Stats/types";
import { defaultState, defaultBatchState } from "../../Stats/defaultStates";
import { reduceAlert } from "../../Stats/reducers";

it("should work", () => {
    const state: IState = defaultState;

    state.overloadDuration = 20;
    state.currentBatch!.traffic = 200;

    const result = reduceAlert(state, state.currentBatch!);

    expect(result.overloadDuration).toBe(30);
    expect(result.message).not.toBeNull();
});