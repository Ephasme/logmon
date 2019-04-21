import * as faker from "faker";
import * as fs from "fs";
import { generateLogLine } from "../__fixtures__/logLineFactory";
import { formatLogLine } from "../__fixtures__/logLineSerializer";

export function truncate(filename: string) {
    if (fs.existsSync(filename)) {
        fs.truncateSync(filename);
    } else {
        fs.writeFileSync(filename, "");
    }
}

export function writeLogLines(filename: string): void {
    fs.appendFileSync(filename, formatLogLine(generateLogLine()));

    setTimeout(() => {
        writeLogLines(filename);
    }, faker.random.arrayElement([100]));
}
