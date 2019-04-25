import { List } from "immutable";
import { generateLogLine } from "../../../__fixtures__/logLineFactory";
import { makeLogs } from "../../../__fixtures__/makeLogBatch";
import { computeTimeGap } from "../../../Store/common/computeTimeGap";
import { Sec } from "../../../Utils/units";

it("should return correct time gap", () => {
    const logs = List([
        generateLogLine({ time: new Date(2015, 0, 0, 0, 0, 12, 0) }),
        generateLogLine({ time: new Date(2015, 0, 0, 0, 0, 10, 0) }),
        generateLogLine({ time: new Date(2015, 0, 0, 0, 0, 10, 0) }),
    ]);
    expect(computeTimeGap(logs, Sec(Infinity))).toEqual(Sec(2));
});

it("should return default value if no time elapsed", () => {
    const logs = List([
        generateLogLine({ time: new Date(2015, 0, 0, 0, 0, 10, 0) }),
        generateLogLine({ time: new Date(2015, 0, 0, 0, 0, 10, 0) }),
    ]);
    expect(computeTimeGap(logs, Sec(15))).toEqual(Sec(15));
});

it("should return default value if no data", () => {
    const logs = List();
    expect(computeTimeGap(logs, Sec(12))).toEqual(Sec(12));
});
