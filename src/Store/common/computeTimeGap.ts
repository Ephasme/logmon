import { List } from "immutable";
import moment = require("moment");
import { ILogLine } from "../../LogWatcher";
import { ISeconds, Sec } from "../../Utils/units";

export type ComputeTimeGap = (logs: List<ILogLine>, nullValue: ISeconds) => ISeconds;

export const computeTimeGap: ComputeTimeGap = (logs, nullValue): ISeconds => {
    const first = logs.first(null);
    const last = logs.last(null);
    if (first && last) {
        const momentFirst = moment(first.time);
        const momentLast = moment(last.time);
        if (momentFirst.isSame(momentLast)) {
            return nullValue;
        }
        return Sec(moment.duration(momentFirst.diff(momentLast)).asSeconds());
    }
    return nullValue;
};
