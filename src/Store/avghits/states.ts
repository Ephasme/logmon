import { List } from "immutable";
import { ILogLine } from "../../LogWatcher";

export interface IAlertMessage {
    type: "alert";
    hits: number;
    time: Date;
}

export interface IInfoMessage {
    type: "info";
    time: Date;
}

export type AnyMessage = IAlertMessage | IInfoMessage;

export type AvgHitsState = Readonly<{
    logs: List<ILogLine>;
    avgHitsPerSeconds: number;
    status: "triggered" | "idle";
    messages: List<AnyMessage>;
}>;

export const defaultAvgHitsStateFactory: () => AvgHitsState = () => ({
    logs: List(),
    status: "idle",
    avgHitsPerSeconds: 0,
    messages: List(),
});
