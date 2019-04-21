import { INewLogAction } from "./common/actions";
import { IStartAnalysis } from "./analysis/actions";
import { IComputeOverloadingAction } from "./load/actions";

export type AnyAction = 
    | INewLogAction
    | IStartAnalysis
    | IComputeOverloadingAction;