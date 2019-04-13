import { filterEmptyString } from "../Utils";
import { IRequestLine } from "./IRequestLine";

const pattern = () => /(?<verb>[^ ]*) (?<uri>[^ ]*) (?<protocol>[^ ]*)/gm;

export function create(line: string): IRequestLine {
    const result = pattern().exec(line);
    if (result) {
        return {
            httpAction: result.groups.verb,
            routeSegments: filterEmptyString(result.groups.uri.split("/")),
            protocol: result.groups.protocol,
        };
    }
    return null;
}
