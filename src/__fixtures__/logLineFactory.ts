import * as faker from "faker";
import { ILogLine } from "../LogWatcher";

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

export function generateLogLine(): ILogLine {
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
        time: new Date(),
        userid: faker.internet.userName(),
    }
}