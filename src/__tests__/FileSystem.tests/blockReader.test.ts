import { readBlock } from "../../FileSystem/readBlock";

let arr: Array<{ev: string, fn: (input: string) => void}> = [];

const mockAddListener = jest.fn().mockImplementation((ev, fn) => {
    arr.push({ ev, fn });
});

jest.mock("readline", () => ({
    createInterface: () => ({
        addListener: mockAddListener,
    }),
}));
jest.mock("fs");

beforeEach(() => {
    arr = [];
});

it("should call the handler on new line", () => {
    const mockHandler = jest.fn();
    readBlock("bla", { start: 1, end: 12 }, mockHandler);
    expect(arr).toHaveLength(1);
    arr[0].fn("input");
    expect(mockAddListener).toBeCalledWith("line", arr[0].fn);
    expect(mockHandler).toBeCalledWith("input");
});
