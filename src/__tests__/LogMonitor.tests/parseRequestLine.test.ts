import { parseRequestLine } from "../../LogMonitor/parseRequestLine";

const str = `POST /api/user HTTP/1.0`;
const invalid = `127.16:00:42`;

it("should return null when null is given", () => {
    const result = parseRequestLine(null);
    expect(result).toBeNull();
});

it("should return null when failing", () => {
    const result = parseRequestLine(invalid);
    expect(result).toBeNull();
});

it("should not be null when success", () => {
    const result = parseRequestLine(str);
    expect(result).not.toBeNull();
});

it("should parse {protocol}", () => {
    const result = parseRequestLine(str);
    expect(result.protocol).toBe("HTTP/1.0");
});

it("should parse {routeSegments}", () => {
    const result = parseRequestLine(str);
    expect(result.routeSegments).toEqual(["api", "user"]);
});

it("should parse {httpAction}", () => {
    const result = parseRequestLine(str);
    expect(result.httpAction).toBe("POST");
});
