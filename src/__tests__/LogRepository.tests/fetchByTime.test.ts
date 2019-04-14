import * as moment from "moment";
import { fetchByTime } from "../../LogRepository/";

it("should return elements that are older than a given time", () => {

    const base = {
        domain: "domain",
        duration: 123,
        httpResultCode: 200,
        hyphen: "-",
        request: {
            httpAction: "GET",
            protocol: "HTTP/1.0",
            routeSegments: ["base", "bla"],
        },
        time: new Date(2018, 5, 5, 13, 43, 12, 123),
        userid: "userid",
    };

    const past14 = moment(base.time).add(14, "ms").toDate();
    const past34 = moment(base.time).add(34, "ms").toDate();
    const past78 = moment(base.time).add(78, "ms").toDate();
    const past187 = moment(base.time).add(1987, "ms").toDate();

    const withTime = (time: Date) => Object.assign({}, base, { time });

    const logs = [
        withTime(past14),
        withTime(past34),
        withTime(past78),
        withTime(past187),
    ];

    const result = fetchByTime(logs, moment(base.time).add(16).toDate());

    const arr = Array.from(result);

    expect(arr).toHaveLength(3);
    expect(arr[0]).toHaveProperty("time", past34);
    expect(arr[1]).toHaveProperty("time", past78);
    expect(arr[2]).toHaveProperty("time", past187);
});
