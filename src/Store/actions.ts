import { IComputeAnalysis } from "./analysis/actions";
import { INewLogAction } from "./common/actions";
import { IComputeOverloadingAction } from "./load/actions";

export type AnyAction =
    | INewLogAction
    | IComputeAnalysis
    | IComputeOverloadingAction;
