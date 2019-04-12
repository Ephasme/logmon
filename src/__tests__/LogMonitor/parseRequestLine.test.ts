import { parseRequestLine } from "../../LogMonitor/LogLineParser";

const str = `POST /api/user HTTP/1.0`;
const invalid = `127.16:00:42`;

it("should return null when failing", () => {
    const result = parseRequestLine(invalid);
    expect(result).toBeNull();
});

it("should not be null when success", () => {
    const result = parseRequestLine(str);
    expect(result).not.toBeNull();
});

it("should parse {domain}", () => {
    const result = parseRequestLine(str);
    expect(result.protocol).toBe("HTTP/1.0");
});

it("should parse {domain}", () => {
    const result = parseRequestLine(str);
    expect(result.uri).toBe("/api/user");
});

it("should parse {domain}", () => {
    const result = parseRequestLine(str);
    expect(result.verb).toBe("POST");
});
