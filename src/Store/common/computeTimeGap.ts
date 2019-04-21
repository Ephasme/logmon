import { List } from "immutable";
import moment = require("moment");
import { ILogLine } from "../../LogWatcher";
import { ISeconds, Sec } from "../../Utils/units";

export const computeTimeGap = (logs: List<ILogLine>, nullValue: ISeconds): ISeconds => {
    const first = logs.first(null);
    const last = logs.last(null);
    if (first && last) {
        return Sec(moment.duration(moment(first.time).diff(last.time)).asSeconds());
    }
    return nullValue;
};
