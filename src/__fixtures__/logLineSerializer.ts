import moment = require("moment");
import { ILogLine } from "../LogWatcher";

export function formatLogLine(log: ILogLine) {
    const requestLine = `${log.request.httpAction} /${log.request.routeSegments.join("/")} ${log.request.protocol}`;
    const date = `${moment(log.time).format("DD/MMM/YYYY:HH:mm:ss ZZ")}`;
    return `${log.domain} - ${log.userid} [${date}] "${requestLine}" ${log.result} ${log.packet}\n`;
}
