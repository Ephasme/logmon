import * as fs from "fs";
import { List } from "immutable";
import * as moment from "moment";
import { IFileSystem, PollingFileWatcher, readBlock } from "./FileSystem";
import { ILogLine, LogWatcher } from "./LogWatcher";
import * as LogLineFactory from "./LogWatcher/LogLineFactory";
import { TailWatcher } from "./TailWatcher";

export const nodeFs: IFileSystem = {
    statSync: fs.statSync,
    existsSync: fs.existsSync,
};

const fileWatcher = new PollingFileWatcher(nodeFs, "data/access.log");
const tailWatcher = new TailWatcher(fileWatcher, readBlock);
const logWatcher = new LogWatcher(LogLineFactory.createFrom, tailWatcher);

const overloadMonitoringDelay = 1000;
const batchAnalysisDelay = 10000;

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
    },
});

export interface INewLogAction {
    type: "NEW_LOG";
    payload: {
        log: ILogLine,
    };
}

export interface ITrimLogAction {
    type: "TRIM_LOGS";
    payload: {
        now: Date,
        ttl: number,
    };
}

export interface IComputeOverloadingAction {
    type: "COMPUTE_OVERLOADING";
    payload: {
        threshold: number;
        timespan: number;
    };
}

export type AnyAction =
    | INewLogAction
    | ITrimLogAction
    | IComputeOverloadingAction;

export const dataReducer = (state: RootState, action: AnyAction): DataState => {
    const { logs } = state;
    switch (action.type) {
        case "COMPUTE_OVERLOADING": {
            const { timespan, threshold } = action.payload;
            const first = logs.first(null);
            const last = logs.last(null);
            if (first && last) {
                const duration = moment(first.time).diff(last.time) / 1000;
                if (duration >= timespan) {
                    const hits = logs.size;
                    const hitsPerSeconds = hits / duration;
                    if (hitsPerSeconds > threshold) {
                        return {
                            message: { type: "alert", hits: hitsPerSeconds, time: first.time },
                            overloadingStatus: "TRIGGERED",
                            currentHitsPerSeconds: hitsPerSeconds,
                            timespan,
                        };
                    } else {
                        return {
                            message: { type: "recover", time: last.time },
                            overloadingStatus: "IDLE",
                            currentHitsPerSeconds: hitsPerSeconds,
                            timespan };
                    }
                }
            }
        }
    }
    return state.data;
};

export const logsReducer = (state: List<ILogLine>, action: AnyAction): List<ILogLine> => {
    switch (action.type) {
        case "NEW_LOG": {
            const { log } = action.payload;
            return state
                .unshift(log);
        }
        case "TRIM_LOGS": {
            const { now, ttl } = action.payload;
            return state
                .takeWhile((x) => {
                    return moment.duration(moment(now).diff(x.time)).seconds() <= ttl;
                });
        }
    }
    return state;
};

export const newLogAction = (log: ILogLine): INewLogAction =>
    ({ type: "NEW_LOG", payload: { log }});

export const trimLogsAction = (now: Date, ttl: number): ITrimLogAction =>
    ({ type: "TRIM_LOGS", payload: { now, ttl }});

export const computeOverloadingAction = (timespan: number, threshold: number): IComputeOverloadingAction =>
    ({ type: "COMPUTE_OVERLOADING", payload: { timespan, threshold }});

class StoreManager {
    private currentState = defaultStateFactory();

    public get state() { return this.currentState; }

    public dispatch(action: AnyAction) {
        this.currentState = {
            data: dataReducer(this.currentState, action),
            logs: logsReducer(this.currentState.logs, action),
        };
    }
}

const storage = new StoreManager();

// export const mainReducer = (state: IState, action: AnyAction) => {
//     return logsReducer(state, action);
// }

const render = (state: RootState) => {
    console.clear();
    console.log(state);
};

logWatcher.watch((log) => {
    storage.dispatch(newLogAction(log));
});

function computeOverloadingProcess() {
    storage.dispatch(computeOverloadingAction(2 * 60, 10));
    storage.dispatch(trimLogsAction(new Date(), 2 * 60));
}

function renderProcess() {
    render(storage.state);
}

setInterval(computeOverloadingProcess, overloadMonitoringDelay);
setInterval(renderProcess, 2000);
