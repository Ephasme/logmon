import { createReadStream } from "fs";
import * as readline from "readline";
import { BlockReader } from ".";

/**
 * This function is responsible to read a precice part of the file.
 * @param block the start and beginning locations of this reading.
 * @param handler the callback to which the result is given.
 */
export const readBlock: BlockReader = (filename, block, handler) => {
    const readStream = createReadStream(filename, block);
    const reader = readline.createInterface(readStream);
    reader.addListener("line", (line) => {
        if (line.trim() !== "") {
            handler(line);
        }
    });
};
