import { IStats } from ".";

export interface IFileSystem {
    statSync(file: string): IStats;
    existsSync(file: string): boolean;
}
