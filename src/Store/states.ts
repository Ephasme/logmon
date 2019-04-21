import { defaultAnalysisStateFactory, IAnalysisState } from "./analysis/states";
import { defaultLoadStateFactory, LoadState } from "./load/states";

export type RootState = Readonly<{
    load: LoadState;
    analysis: IAnalysisState;
}>;

export const defaultStateFactory: () => RootState = () => ({
    load: defaultLoadStateFactory(),
    analysis: defaultAnalysisStateFactory(),
});
