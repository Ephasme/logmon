import { Ms, Sec, toSec } from "../../Utils/units";

it("should convert ms to seconds", () => {
    expect(toSec(Ms(5000))).toEqual(Sec(5));
});

it("should convert to floating partial seconds", () => {
    expect(toSec(Ms(200))).toEqual(Sec(0.2));
});
