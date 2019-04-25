import { defaultAnalysisStateFactory, IAnalysisState } from "./analysis/states";
import { AvgHitsState, defaultAvgHitsStateFactory } from "./avghits/states";

export type RootState = Readonly<{
    analysis: IAnalysisState;
    avgHits: AvgHitsState;
}>;

export const defaultStateFactory: () => RootState = () => ({
    analysis: defaultAnalysisStateFactory(),
    avgHits: defaultAvgHitsStateFactory(),
});
