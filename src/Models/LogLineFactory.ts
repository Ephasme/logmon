import * as moment from "moment";
import { ILogLine } from "./ILogLine";
import * as RequestLineFactory from "./RequestLineFactory";

/* tslint:disable */
const pattern = () => /(?<domain>[^ ]*) (?<hyphen>[^ ]*) (?<userid>[^ ]*) \[(?<time>[^]*)\] "(?<action>[^"]*)" (?<resultcode>[^ ]*) (?<duration>[^ ]*)/gm;
/* tslint:enable */

export type FactoryFunction = (line: string) => ILogLine | null;

export const createFrom: FactoryFunction = (line) => {
    if (line === null) return null;
    const trimedLine = line.trim();
    if (trimedLine === "") return null;
    const result = pattern().exec(line);
    if (result === null) return null;
    return {
        domain: result.groups.domain,
        hyphen: result.groups.hyphen,
        userid: result.groups.userid,
        time: moment(result.groups.time, "DD/MMM/YYYY:HH:mm:ss Z").toDate(),
        request: RequestLineFactory.createFrom(result.groups.action),
        httpResultCode: parseInt(result.groups.resultcode),
        duration: parseInt(result.groups.duration),
    };
}
