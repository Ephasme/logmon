import { IAnalysisCompute } from "./analysis/actions";
import { IAvgHitsCompute } from "./avghits/actions";
import { INewLog } from "./common/actions";

export type AnyAction =
    | INewLog
    | IAnalysisCompute
    | IAvgHitsCompute
    ;
