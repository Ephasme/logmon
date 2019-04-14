import * as Factory from "../../Models/RequestLineFactory";

const str = `POST /api/user HTTP/1.0`;
const invalid = `127.16:00:42`;

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

it("should parse {protocol}", () => {
    const result = Factory.createFrom(str);
    expect(result.protocol).toBe("HTTP/1.0");
});

it("should parse {routeSegments}", () => {
    const result = Factory.createFrom(str);
    expect(result.routeSegments).toEqual(["api", "user"]);
});

it("should parse {httpAction}", () => {
    const result = Factory.createFrom(str);
    expect(result.httpAction).toBe("POST");
});
