import { List } from "immutable";
import { generateLogLine } from "../../../../__fixtures__/logLineFactory";
import { createBasicStatsFrom } from "../../../../Store/analysis/utils/createBasicStatsFrom";

it("sould add error when result is not 200ish", () => {
    const result = createBasicStatsFrom(List([
        generateLogLine({
            result: 404,
        }),
    ]));

    expect(result.errors).toBe(1);
});

it("sould not add error when result is 200ish", () => {
    const result = createBasicStatsFrom(List([
        generateLogLine({
            result: 204,
        }),
    ]));

    expect(result.errors).toBe(0);
});
