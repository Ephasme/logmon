import { IComputeAnalysis } from "./analysis/actions";
import { INewLog } from "./common/actions";
import { IComputeOverloading } from "./load/actions";

export type AnyAction =
    | INewLog
    | IComputeAnalysis
    | IComputeOverloading;
