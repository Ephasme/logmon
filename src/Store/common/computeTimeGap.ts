import { List } from "immutable";
import { ILogLine } from "../../LogWatcher";
import moment = require("moment");
import { Sec, Seconds } from "../../Utils/units";

export const computeTimeGap = (logs: List<ILogLine>, nullValue: Seconds): Seconds => {
    const first = logs.first(null);
    const last = logs.last(null);
    if (first && last) {
        return Sec(moment.duration(moment(first.time).diff(last.time)).asSeconds());
    }
    return nullValue;
}