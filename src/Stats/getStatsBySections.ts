import { Map } from "immutable";
import { ILogLine } from "../Models/ILogLine";
import { groupBySections } from "./groupBySections";
import { IStatDto } from "./IStats";

export function getStatsBySections(logs: ILogLine[]): Map<string, IStatDto> {
    return groupBySections(logs).map((x) => ({
        size: x.size,
        traffic: x.reduce((acc, el) => acc + el.packet, 0),
    }));
}
