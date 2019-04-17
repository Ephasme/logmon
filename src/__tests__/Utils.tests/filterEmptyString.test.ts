import { filterEmptyString } from "../../Utils";

const withEmptyStringArray = ["value", ""];
const emptyArray: string[] = [];

it ("should filter empty string", () => {
    expect(filterEmptyString(withEmptyStringArray)).toEqual(["value"]);
});

it ("should return empty array when empty array is given", () => {
    expect(filterEmptyString(emptyArray)).toEqual([]);
});

