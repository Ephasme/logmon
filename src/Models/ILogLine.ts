import { IRequestLine } from "./IRequestLine";

export interface ILogLine {
    domain: string;
    hyphen: string;
    userid: string;
    time: Date;
    request: IRequestLine;
    result: number;
    packet: number;
}
