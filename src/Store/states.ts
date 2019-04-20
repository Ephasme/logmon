import { List } from "immutable";
import { ILogLine } from "../LogWatcher";

export const OVERLOADING = "OVERLOADING";
export type OverloadedStatus = {
    type: typeof OVERLOADING,
    since: Date,
    hits: number,
};

export const RECOVERING = "RECOVERING"
export type RecoveredStatus = {
    type: typeof RECOVERING,
    since: Date,
};

export const IDLE = "IDLE"
export type IdleStatus = {
    type: typeof IDLE,
    since: Date,
};

export type AnyStatus =
    | IdleStatus
    | RecoveredStatus
    | OverloadedStatus; 

export type AlertState = Readonly<{
    status: AnyStatus,
    logs: List<ILogLine>,
}>;

export type RootState = Readonly<{
    alert: AlertState;
}>;

export const defaultStateFactory: () => RootState = () => ({
    alert: {
        status: { type: IDLE, since: new Date() },
        logs: List(),
    },
});
