import { ILogLine } from "../Models/ILogLine";
import * as fs from "fs";
import * as moment from "moment";
import * as faker from "faker";

function formatLogLine(log: ILogLine) {
    const requestLine = `${log.request.httpAction} ${log.request.routeSegments.join("/")} ${log.request.protocol}`;
    const date = `${moment(log.time).format("DD/MMM/YYYY:HH:mm:ss Z")}`
    return `${log.domain} - ${log.userid} [${date}] "${requestLine}" ${log.result} ${log.packet}\n`
}

const randomAction = () => faker.random.arrayElement([
    "GET", "POST", "DELETE", "PUT", "PATCH", "HEAD"
])

const randomSection = () => faker.random.arrayElement([
    "section1", "section2",
    "section3", "section4",
    "section5"]);

const randomSubSection = () => faker.random.arrayElement([
    "sub1", "sub2",
    "sub3", "sub4",
    "sub5"]);

function generateLogLine(): ILogLine {
    return {
        domain: faker.internet.ip(),
        hyphen: "-",
        packet: faker.random.number({ min: 0, max: 241 }),
        request: {
            httpAction: randomAction(),
            protocol: faker.internet.protocol(),
            routeSegments: [ randomSection(), randomSubSection() ],
        },
        result: faker.random.number({ min: 0, max: 599 }),
        time: faker.date.recent(),
        userid: faker.internet.userName(),
    }
}

export function truncate(filename: string) {
    fs.truncateSync(filename);
}

export function writeLogLines(filename: string): void {

    fs.appendFileSync(filename, formatLogLine(generateLogLine()));

    setTimeout(() => {
        writeLogLines(filename);
    }, faker.random.number({ min: 30, max: 45 }));
}
