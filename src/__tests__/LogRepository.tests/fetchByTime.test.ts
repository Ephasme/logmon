import * as moment from "moment";
import { factory } from "../../LogRepository/";

const makeLog = () => {
    return ;
};

it("should return elements that are older than a given time", () => {

    const repo = factory();

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

    const firstTime = moment(base.time).add(14, "ms").toDate();
    repo.add(Object.assign({}, base, {
        time: firstTime,
    }));
    const nTime34 = moment(base.time).add(34, "ms").toDate();
    repo.add(Object.assign({}, base, {
        time: nTime34,
    }));
    const nTime78 = moment(base.time).add(78, "ms").toDate();
    repo.add(Object.assign({}, base, {
        time: nTime78,
    }));
    const nTimem187 = moment(base.time).add(1987, "ms").toDate();
    repo.add(Object.assign({}, base, {
        time: nTimem187,
    }));

    const result = repo.fetchByTime(moment(base.time).add(16).toDate());

    const arr = Array.from(result);

    expect(arr).toHaveLength(3);
    expect(arr[0]).toHaveProperty("time", nTime34);
    expect(arr[1]).toHaveProperty("time", nTime78);
    expect(arr[2]).toHaveProperty("time", nTimem187);
});
