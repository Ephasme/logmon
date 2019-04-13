import { filterEmptyString } from "../../Utils";

const withNullArray = [null, "value"];
const withEmptyStringArray = ["value", ""];
const emptyArray: string[] = [];
const nullArray: [] | null = null;

it ("should filter empty string", () => {
    expect(filterEmptyString(withEmptyStringArray)).toEqual(["value"]);
});

it ("should filter null", () => {
    expect(filterEmptyString(withNullArray)).toEqual(["value"]);
});

it ("should return empty array when empty array is given", () => {
    expect(filterEmptyString(emptyArray)).toEqual([]);
});

it ("should return empty array when null is given", () => {
    expect(filterEmptyString(nullArray)).toEqual([]);
});
