import { ILogLine } from "../Models/ILogLine";

export interface ILogRepository {
    save(logLine: ILogLine): void;
}
