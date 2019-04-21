import { List, Map } from "immutable";
import { ILogLine } from "../../LogWatcher";
import { defaultBasicStatsFactory, IBasicStats } from "./utils/createBasicStatsFrom";

export interface IAnalysisState {
    sections: Map<string, IBasicStats>;
    totalAll: IBasicStats;
    totalBatch: IBasicStats;
    currentBatch: List<ILogLine>;
}

export const defaultAnalysisStateFactory: () => IAnalysisState = () => ({
    currentBatch: List(),
    totalAll: defaultBasicStatsFactory(),
    totalBatch: defaultBasicStatsFactory(),
    sections: Map(),
});
