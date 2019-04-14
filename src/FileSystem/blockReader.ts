import { createReadStream } from "fs";
import * as readline from "readline";

export interface IBlock {
    start: number;
    end: number;
}

export type BlockReader = (filename: string, block: IBlock, onLog: (data: string) => void) => void;

export const readBlock: BlockReader = (filename, block, handler) => {
    const rs = createReadStream(filename, block);
    const rl = readline.createInterface(rs);
    rl.addListener("line", (line) => {
        if (line.trim() !== "") {
            handler(line);
        }
    });
};
