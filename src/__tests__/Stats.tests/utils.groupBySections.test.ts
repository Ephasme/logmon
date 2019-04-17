import { ILogLine } from "../../Models/ILogLine";
import { groupBySections } from "../../Stats/utils";

const $with = (base: ILogLine, obj: any) => Object.assign({}, base, obj);

const logFactory = {
    create() {
        const base: ILogLine = {
            domain: "domain",
            packet: 123,
            result: 200,
            hyphen: "-",
            request: {
                httpAction: "GET",
                protocol: "HTTP/1.0",
                routeSegments: ["group1", "cxbvcsgreyutr"],
            },
            time: new Date(2018, 5, 5, 13, 43, 12, 123),
            userid: "userid",
        };

        return [
            base,
            $with(base, {
                request: {
                    routeSegments: ["group2", "treztyuhjfkjf"],
                },
            }),
            $with(base, {
                request: {
                    routeSegments: ["group2", "reivbfhjdkg"],
                },
            }),
            $with(base, {
                request: {
                    routeSegments: ["group3", "bvhcjghjfdh"],
                },
            }),
            $with(base, {
                request: {
                    routeSegments: ["group4", "erhgdfhgfgfd"],
                },
            }),
        ];
    },
};

it("should return empty set if logs are empty", () => {
    const groups = groupBySections([]);
    expect(groups.size).toBe(0);
});

it("should group by first route segment", () => {
    const groups = groupBySections(logFactory.create());

    expect(Array.from(groups.keys()))
        .toEqual(["group1", "group2", "group3", "group4"]);
});
