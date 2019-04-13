import { filterEmptyString } from "../Utils";
import { IRequestLineDto } from "./IRequestLineDto";

const pattern = () => /(?<verb>[^ ]*) (?<uri>[^ ]*) (?<protocol>[^ ]*)/gm;

export function parseRequestLine(line: string): IRequestLineDto {
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
