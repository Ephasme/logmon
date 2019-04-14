import * as fs from "fs";
import { IFileSystem } from "../FileSystem";

export const nodeFs: IFileSystem = {
    statSync: fs.statSync,
};
