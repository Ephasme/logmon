import * as fs from "fs";
import * as faker from "faker";
import { formatLogLine } from "../__fixtures__/logLineSerializer";
import { generateLogLine } from "../__fixtures__/logLineFactory";

export function truncate(filename: string) {
    fs.truncateSync(filename);
}

export function writeLogLines(filename: string): void {
    fs.appendFileSync(filename, formatLogLine(generateLogLine()));

    setTimeout(() => {
        writeLogLines(filename);
    }, faker.random.arrayElement([100]));
}
