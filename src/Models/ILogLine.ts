import { IRequestLine } from "./IRequestLine";

export interface ILogLine {
    domain: string;
    hyphen: string;
    userid: string;
    time: Date;
    request: IRequestLine;
    httpResultCode: number;
    duration: number;
}
