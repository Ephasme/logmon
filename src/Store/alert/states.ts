import { List } from "immutable";

import { ILogLine } from "../../LogWatcher";

export const OVERLOADING = "OVERLOADING";
export type OverloadingStatus = {
    type: typeof OVERLOADING,
    since: Date,
    hits: number,
};

export const RECOVERING = "RECOVERING"
export type RecoveringStatus = {
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
    | RecoveringStatus
    | OverloadingStatus; 

export type AlertState = Readonly<{
    status: AnyStatus,
    logs: List<ILogLine>,
}>;

export const defaultAlertStateFactory: () => AlertState = () => ({
    status: { type: IDLE, since: new Date() },
    logs: List(),
});
