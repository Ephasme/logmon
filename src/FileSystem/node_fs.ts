import * as fs from 'fs';
import { IFileSystem } from ".";

export const node_fs: IFileSystem = {
    statSync: fs.statSync,
}