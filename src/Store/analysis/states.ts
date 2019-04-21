import { Map, List } from "immutable";
import { ILogLine } from "../../LogWatcher";
import { IBasicStats, defaultBasicStatsFactory } from "./utils/createBasicStatsFrom";

export type AnalysisState = {
    sections: Map<string, IBasicStats>;
    totalAll: IBasicStats;
    totalBatch: IBasicStats;
    currentBatch: List<ILogLine>;
}

export const defaultAnalysisStateFactory: () => AnalysisState = () => ({
    currentBatch: List(),
    totalAll: defaultBasicStatsFactory(),
    totalBatch: defaultBasicStatsFactory(),
    sections: Map(),
});
