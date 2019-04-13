import * as moment from "moment";
import { ILogLineDto } from "./ILogLineDto";

/* tslint:disable */
const pattern = () => /(?<domain>[^ ]*) (?<hyphen>[^ ]*) (?<userid>[^ ]*) \[(?<time>[^]*)\] "(?<action>[^"]*)" (?<resultcode>[^ ]*) (?<duration>[^ ]*)/gm;
/* tslint:enable */

export function parseLogLine(line: string): ILogLineDto | null {
    const result = pattern().exec(line);
    if (result) {
        return {
            domain: result.groups.domain,
            hyphen: result.groups.hyphen,
            userid: result.groups.userid,
            time: moment(result.groups.time, "DD/MMM/YYYY:HH:mm:ss Z").toDate(),
            request: result.groups.action,
            httpResultCode: parseInt(result.groups.resultcode),
            duration: parseInt(result.groups.duration),
        };
    }
    return null;
}
