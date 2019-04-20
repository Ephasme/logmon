import { logsReducer, IState, createNewLogBufferAction } from "../index";
import { generateLogLine } from "../__fixtures__/logLineFactory";
import { List } from "immutable";

it("should work as expected", () => {
    const log1 = generateLogLine(); log1.time = new Date(2015, 12, 1, 51, 2, 1, 123);
    const log2 = generateLogLine(); log2.time = new Date(2015, 12, 1, 51, 2, 3, 123);
    const log3 = generateLogLine(); log3.time = new Date(2015, 12, 1, 51, 2, 5, 123);
    const log4 = generateLogLine(); log4.time = new Date(2015, 12, 1, 51, 2, 2, 123);
    const log5 = generateLogLine(); log5.time = new Date(2015, 12, 1, 51, 2, 4, 123);

    const state: IState = {
        firstLog: null,
        hits: 0,
        lastLog: null,
        lastLogDate: new Date(),
        logs: List(),
        time: 0,
    };

    createNewLogBufferAction({  })

    state.
})