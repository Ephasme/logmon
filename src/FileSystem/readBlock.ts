import { createReadStream } from "fs";
import * as readline from "readline";
import { BlockReader } from ".";

export const readBlock: BlockReader = (filename, block, handler) => {
    const readStream = createReadStream(filename, block);
    const reader = readline.createInterface(readStream);
    reader.addListener("line", (line) => {
        if (line.trim() !== "") {
            handler(line);
        }
    });
};
