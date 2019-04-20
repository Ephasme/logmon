import { runComputeOverloadingAction } from "../../../Store/reducers";
import { generateLogLine } from "../../../__fixtures__/logLineFactory";
import { List } from "immutable";
import { computeOverloadingAction } from "../../../Store/actions";
import { defaultStateFactory } from "../../../Store/states";

it("should work normally", () => {

    const logs = List([
        generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 51) }),
        generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 51) }),
        generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 51) }),
        generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 52) }),
        generateLogLine({ time: new Date(2015, 1, 2, 1, 12, 52) }),
    ]);

    const state = defaultStateFactory();

    const result = runComputeOverloadingAction(state, computeOverloadingAction(5, 2));
    
    console.log(result);
});