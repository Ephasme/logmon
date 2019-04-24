import * as moment from "moment";
import * as RequestLineFactory from "./RequestLineFactory";
import { ILogLine } from "./types/ILogLine";

/* tslint:disable */
const pattern = () => /(?<domain>[^ ]*) (?<hyphen>[^ ]*) (?<userid>[^ ]*) \[(?<time>[^]*)\] "(?<action>[^"]*)" (?<resultcode>[^ ]*) (?<packet>[^ ]*)/gm;
/* tslint:enable */

export type FactoryFunction = (line: string) => ILogLine | null;

export const createFrom: FactoryFunction = (line) => {
    if (line === null) return null;
    const trimedLine = line.trim();
    if (trimedLine === "") return null;
    const result = pattern().exec(line);
    if (result === null) return null;
    if (result.groups) {
        const requestLine = RequestLineFactory.createFrom(result.groups.action);
        if (requestLine) {
            return {
                domain: result.groups.domain,
                hyphen: result.groups.hyphen,
                userid: result.groups.userid,
                time: moment(result.groups.time, "DD/MMM/YYYY:HH:mm:ss Z").toDate(),
                request: requestLine,
                result: parseInt(result.groups.resultcode, 10),
                packet: parseInt(result.groups.packet, 10),
            };
        }
    }
    return null;
};
