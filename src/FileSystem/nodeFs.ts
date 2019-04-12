import * as fs from "fs";
import { IFileSystem } from ".";

export const nodeFs: IFileSystem = {
    statSync: fs.statSync,
};
