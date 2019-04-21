import { LoadState, defaultLoadStateFactory } from "./load/states";
import { AnalysisState, defaultAnalysisStateFactory } from "./analysis/states";

export type RootState = Readonly<{
    alert: LoadState;
    analysis: AnalysisState;
}>;

export const defaultStateFactory: () => RootState = () => ({
    alert: defaultLoadStateFactory(),
    analysis: defaultAnalysisStateFactory(),
});
