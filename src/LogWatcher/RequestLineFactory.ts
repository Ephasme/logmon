import * as utils from "../Utils";
import { IRequestLine } from "./types/IRequestLine";

const pattern = () => /(?<verb>[^ ]*) (?<uri>[^ ]*) (?<protocol>[^ ]*)/gm;

export function createFrom(line: string): IRequestLine | null {
    const trimedLine = line.trim();
    if (trimedLine === "") return null;
    const result = pattern().exec(line);
    if (result && result.groups) {
        return {
            httpAction: result.groups.verb,
            routeSegments: utils.filterEmptyString(result.groups.uri.split("/")),
            protocol: result.groups.protocol,
        };
    }
    return null;
}
