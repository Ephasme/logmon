import * as Factory from "../../Models/LogLineFactory";

const str = `127.0.0.1 - mary [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12`;
const invalid = `127.16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12`;

it("should return null when empty string is given", () => {
    const result = Factory.createFrom("    \r\n\t");
    expect(result).toBeNull();
});

it("should return null when null is given", () => {
    const result = Factory.createFrom(null);
    expect(result).toBeNull();
});

it("should return null when failing", () => {
    const result = Factory.createFrom(invalid);
    expect(result).toBeNull();
});

it("should not be null when success", () => {
    const result = Factory.createFrom(str);
    expect(result).not.toBeNull();
});

it("should parse {domain}", () => {
    const result = Factory.createFrom(str);
    expect(result.domain).toBe("127.0.0.1");
});

it("should parse {hyphen}", () => {
    const result = Factory.createFrom(str);
    expect(result.hyphen).toBe("-");
});

it("should parse {userid}", () => {
    const result = Factory.createFrom(str);
    expect(result.userid).toBe("mary");
});

it("should parse {time}", () => {
    const result = Factory.createFrom(str);
    expect(result.time.toISOString()).toBe("2018-05-09T16:00:42.000Z");
});

it("should parse {request}", () => {
    const result = Factory.createFrom(str);
    expect(result.request).toEqual({
        httpAction: "POST",
        routeSegments: ["api", "user"],
        protocol: "HTTP/1.0",
    });
});

it("should parse {result}", () => {
    const result = Factory.createFrom(str);
    expect(result.result).toBe(503);
});

it("should parse {packet}", () => {
    const result = Factory.createFrom(str);
    expect(result.packet).toBe(12);
});
