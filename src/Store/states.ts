import { LoadState, defaultLoadStateFactory } from "./load/states";
import { AnalysisState, defaultAnalysisStateFactory } from "./analysis/states";

export type RootState = Readonly<{
    load: LoadState;
    analysis: AnalysisState;
}>;

export const defaultStateFactory: () => RootState = () => ({
    load: defaultLoadStateFactory(),
    analysis: defaultAnalysisStateFactory(),
});
