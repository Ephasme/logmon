import { IStats } from ".";

export interface IFileWatcher {
    watch(onChange: (stats: IStats, filename: string) => void): void;
}
