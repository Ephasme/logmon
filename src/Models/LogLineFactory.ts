import * as moment from "moment";
import { ILogLine } from "./ILogLine";
import * as RequestLineFactory from "./RequestLineFactory";

/* tslint:disable */
const pattern = () => /(?<domain>[^ ]*) (?<hyphen>[^ ]*) (?<userid>[^ ]*) \[(?<time>[^]*)\] "(?<action>[^"]*)" (?<resultcode>[^ ]*) (?<duration>[^ ]*)/gm;
/* tslint:enable */

export function create(line: string): ILogLine | null {
    const result = pattern().exec(line);
    if (result) {
        return {
            domain: result.groups.domain,
            hyphen: result.groups.hyphen,
            userid: result.groups.userid,
            time: moment(result.groups.time, "DD/MMM/YYYY:HH:mm:ss Z").toDate(),
            request: RequestLineFactory.create(result.groups.action),
            httpResultCode: parseInt(result.groups.resultcode),
            duration: parseInt(result.groups.duration),
        };
    }
    return null;
}
