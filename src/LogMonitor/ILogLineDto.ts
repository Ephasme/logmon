export interface ILogLineDto {
    domain: string;
    hyphen: string;
    userid: string;
    time: Date;
    request: string;
    httpResultCode: number;
    duration: number;
}
