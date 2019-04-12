import { parseLogLine } from "../LogMonitor/LogLineParser";

const str = `127.0.0.1 - mary [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12`;
const invalid = `127.16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12`;

it("should return null when failing", () => {
    const result = parseLogLine(invalid);
    expect(result).toBeNull();
});

it("should not be null when success", () => {
    const result = parseLogLine(str);
    expect(result).not.toBeNull();
});

it("should parse {domain}", () => {
    const result = parseLogLine(str);
    expect(result.domain).toBe("127.0.0.1");
});

it("should parse {hyphen}", () => {
    const result = parseLogLine(str);
    expect(result.hyphen).toBe("-");
});

it("should parse {userid}", () => {
    const result = parseLogLine(str);
    expect(result.userid).toBe("mary");
});

it("should parse {time}", () => {
    const result = parseLogLine(str);
    expect(result.time.toISOString()).toBe("2018-05-09T16:00:42.000Z");
});

it("should parse {request}", () => {
    const result = parseLogLine(str);
    expect(result.request).toBe("POST /api/user HTTP/1.0");
});

it("should parse {httpResultCode}", () => {
    const result = parseLogLine(str);
    expect(result.httpResultCode).toBe(503);
});

it("should parse {duration}", () => {
    const result = parseLogLine(str);
    expect(result.duration).toBe(12);
});
