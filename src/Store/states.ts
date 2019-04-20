import { ILogLine } from "../LogWatcher";
import { List } from "immutable";

export interface IAlertMessage {
    type: "alert";
    hits: number;
    time: Date;
}

export interface IRecoverMessage {
    type: "recover";
    time: Date;
}

export type AnyMessage = IAlertMessage | IRecoverMessage;

export type DataState = Readonly<{
    overloadingStatus: "IDLE" | "TRIGGERED",
    message: AnyMessage | null,
    currentHitsPerSeconds: number,
    timespan: number;
}>;

export type RootState = Readonly<{
    logs: List<ILogLine>;
    data: DataState;
}>;

export const defaultStateFactory: () => RootState = () => ({
    logs: List<ILogLine>(),
    data: {
        overloadingStatus: "IDLE",
        message: null,
        currentHitsPerSeconds: 0,
        timespan: 0,
    },
});
