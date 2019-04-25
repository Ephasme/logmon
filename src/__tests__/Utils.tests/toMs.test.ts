import { Ms, Sec, toMs } from "../../Utils/units";

it("should convert seconds to ms", () => {
    expect(toMs(Sec(5))).toEqual(Ms(5000));
});
