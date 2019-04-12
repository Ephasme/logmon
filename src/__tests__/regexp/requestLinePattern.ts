import { requestLinePattern } from "../../LogMonitor/regexp";

const rlValid = `POST /api/user HTTP/1.0`;
const rlInvalid = `POST/api/user HTTP/1.0`;

it ("should match the regex when valid", () => {
    expect(requestLinePattern().test(rlValid)).toBeTruthy();
});

it ("should not match the regex when invalid", () => {
    expect(requestLinePattern().test(rlInvalid)).toBeFalsy();
});

it ("should not match the regex when null", () => {
    expect(requestLinePattern().test(null)).toBeFalsy();
});
