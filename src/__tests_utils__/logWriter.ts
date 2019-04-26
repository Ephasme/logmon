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

export class TestWriter {
    private mSpeed: number = 100;

    public set speed(value: number) { this.mSpeed = value; }
    public get speed() { return this.mSpeed; }

    public writeLogLines(filename: string): void {
        fs.appendFileSync(filename, formatLogLine(generateLogLine()));
        setTimeout(() => this.writeLogLines(filename), this.speed);
    }
}
