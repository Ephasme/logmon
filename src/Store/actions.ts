import { INewLogAction } from "./common/actions";
import { IComputeAnalysis } from "./analysis/actions";
import { IComputeOverloadingAction } from "./load/actions";

export type AnyAction = 
    | INewLogAction
    | IComputeAnalysis
    | IComputeOverloadingAction;