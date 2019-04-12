import * as moment from "moment";
import { logLinePattern, requestLinePattern } from "./regexp";

export interface ILogLineDto {
    domain: string;
    hyphen: string;
    userid: string;
    time: Date;
    request: string;
    httpResultCode: number;
    duration: number;
}

export interface IRequestLineDto {
    verb: string;
    uri: string;
    protocol: string;
}

export function parseRequestLine(line: string): IRequestLineDto {
    const result = requestLinePattern().exec(line);
    if (result) {
        return {
            verb: result.groups.verb,
            uri: result.groups.uri,
            protocol: result.groups.protocol,
        };
    }
    return null;
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
            httpResultCode: Number.parseInt(result.groups.resultcode),
            duration: Number.parseInt(result.groups.duration),
        };
    }
    return null;
}
