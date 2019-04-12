import * as moment from "moment";
import { logLinePattern } from "./regexp";

export interface ILogLineDto {
    domain: string;
    hyphen: string;
    userid: string;
    time: Date;
    request: string;
    httpResultCode: number;
    duration: number;
}

export function parseLogLine(line: string): ILogLineDto | null {
    const result = logLinePattern().exec(line);
    if (result) {
        return {
            domain: result.groups.domain,
            hyphen: result.groups.hyphen,
            userid: result.groups.userid,
            time: moment(result.groups.time, "DD/MMM/YYYY:HH:mm:ss Z").toDate(),
            request: result.groups.action,
            httpResultCode: Number.parseInt(result.groups.resultcode, 10),
            duration: Number.parseInt(result.groups.duration, 10),
        };
    }
    return null;
}
