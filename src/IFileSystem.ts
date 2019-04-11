import * as fs from 'fs';

export interface IFileSystem {
    statSync(file: string): fs.Stats;
}

export const node_fs: IFileSystem = {
    statSync: fs.statSync,
}