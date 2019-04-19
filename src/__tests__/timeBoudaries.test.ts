import { timeBoundaries } from "../timeBoudaries";
import { generateLogLine } from "../__fixtures__/logLineFactory";
import { List } from "immutable";

it("should return null if impossible to find min and max", () => {
    expect(() => timeBoundaries(List())).toThrow();
});

it("should work normally", () => {
    const log1 = generateLogLine(); log1.time = new Date(2015, 12, 1, 51, 2, 21, 123);
    const log2 = generateLogLine(); log2.time = new Date(2015, 12, 1, 51, 2, 31, 123);
    const log3 = generateLogLine(); log3.time = new Date(2015, 12, 1, 51, 2, 41, 123);
    const log4 = generateLogLine(); log4.time = new Date(2015, 12, 1, 51, 2, 51, 123);

    const result = timeBoundaries(List([ log1, log3, log4, log2 ]));
    
    expect(result && result.older.time).toBe(log4.time);
    expect(result && result.younger.time).toBe(log1.time);
});