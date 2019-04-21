import { List } from "immutable";
import { ILogLine } from "../../LogWatcher";
import moment = require("moment");

export const computeTimeGap = (logs: List<ILogLine>, nullValue: number): number => {
    const first = logs.first(null);
    const last = logs.last(null);
    if (first && last) {
        const gap = moment(first.time).diff(last.time) / 1000;
        return gap;
    }
    return nullValue;
}