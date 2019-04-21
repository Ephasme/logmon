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

export type LoadState = Readonly<{
    overloadDuration: number,
    status: "TRIGGERED" | "IDLE",
    message?: AnyMessage,
    logs: List<ILogLine>,
}>;

export const defaultLoadStateFactory: () => LoadState = () => ({
    overloadDuration: 0,
    status: "IDLE",
    logs: List(),
});
