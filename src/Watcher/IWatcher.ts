import { IStats } from "../FileSystem";

export interface IWatcher {
    watch(onChange: (stats: IStats) => void);
}
