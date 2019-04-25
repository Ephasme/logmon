import { generateLogLine } from "../../../__fixtures__/logLineFactory";
import { newLog } from "../../../Store/common/actions";
import { defaultStateFactory } from "../../../Store/states";
import { StoreManager } from "../../../Store/store";

it("should call all reducers", () => {
    const red1 = jest.fn();
    const red2 = jest.fn();
    const state = defaultStateFactory();
    const storeMan = new StoreManager(state, red1, red2);

    const action = newLog(generateLogLine());
    storeMan.dispatch(action);

    expect(red2).toBeCalledWith(state.analysis, action);
});

it("should provide the state", () => {
    const red1 = jest.fn();
    const red2 = jest.fn();
    const state = defaultStateFactory();
    const storeMan = new StoreManager(state, red1, red2);

    expect(storeMan.state).toBe(state);
});
