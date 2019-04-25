import { filterEmptyString } from "../../Utils";

it("should filter empty string", () => {
    expect(filterEmptyString([""])).toHaveLength(0);
});
