import { generateLogLine } from "../__fixtures__/logLineFactory";
import { hitsBySeconds } from "../hitsBySeconds";

it("should work as expected", () => {
    const log1 = generateLogLine(); log1.time = new Date(2015, 12, 1, 51, 2, 21, 123);
    const log2 = generateLogLine(); log2.time = new Date(2015, 12, 1, 51, 2, 31, 123);
    const log3 = generateLogLine(); log3.time = new Date(2015, 12, 1, 51, 2, 41, 123);
    const log4 = generateLogLine(); log4.time = new Date(2015, 12, 1, 51, 2, 51, 123);

    const result = hitsBySeconds([ log1, log3, log4, log2 ]);

    expect(result).toBe(4/(42-12));
});

it("should work as expected", () => {
    const log1 = generateLogLine(); log1.time = new Date(2015, 12, 1, 51, 2, 21, 123);
    const log2 = generateLogLine(); log2.time = new Date(2015, 12, 1, 51, 2, 21, 123);
    const log3 = generateLogLine(); log3.time = new Date(2015, 12, 1, 51, 2, 21, 123);
    const log4 = generateLogLine(); log4.time = new Date(2015, 12, 1, 51, 2, 21, 123);

    const result = hitsBySeconds([ log1, log3, log4, log2 ]);

    expect(result).toBe(4/1);
});

it("should return 0 when logs contain only one element", () => {
    const log1 = generateLogLine(); log1.time = new Date(2015, 12, 1, 51, 2, 21, 123);
    const result = hitsBySeconds([ log1 ]);
    expect(result).toBe(0);
});

it("should return 0 when logs are empty", () => {
    const result = hitsBySeconds([]);
    expect(result).toBe(0);
})

it("should throw when logs are null", () => {
    expect(() => hitsBySeconds(null!)).toThrow();
})