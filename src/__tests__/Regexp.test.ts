import { logLinePattern } from "../LogMonitor/regexp";

const str = `127.0.0.1 - mary [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12`;
const invalidStr = `ry [09/May/2018:16:00:42 +0000] "POST /api/user HTTP/1.0" 503 12`;

it ("should match the regex when valid", () => {
    expect(logLinePattern().test(str)).toBeTruthy();
});

it ("should not match the regex when invalid", () => {
    expect(logLinePattern().test(invalidStr)).toBeFalsy();
});