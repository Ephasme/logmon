import * as utils from "../Utils";
import { IRequestLine } from "./IRequestLine";

const pattern = () => /(?<verb>[^ ]*) (?<uri>[^ ]*) (?<protocol>[^ ]*)/gm;

export function createFrom(line: string): IRequestLine {
    if (line === null) return null;
    const trimedLine = line.trim();
    if (trimedLine === "") return null;
    const result = pattern().exec(line);
    if (result === null) return null;
    return {
        httpAction: result.groups.verb,
        routeSegments: utils.filterEmptyString(result.groups.uri.split("/")),
        protocol: result.groups.protocol,
    };
}
