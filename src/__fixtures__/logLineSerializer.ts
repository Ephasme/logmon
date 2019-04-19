import { ILogLine } from "../Models/ILogLine";
import moment = require("moment");

export function formatLogLine(log: ILogLine) {
    const requestLine = `${log.request.httpAction} ${log.request.routeSegments.join("/")} ${log.request.protocol}`;
    const date = `${moment(log.time).format("DD/MMM/YYYY:HH:mm:ss Z")}`
    return `${log.domain} - ${log.userid} [${date}] "${requestLine}" ${log.result} ${log.packet}\n`
}