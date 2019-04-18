import { reduceErrors } from "../../Stats/reducers";

it("should increase counter when status is not 200ish", () => {
    expect(reduceErrors(0, 512)).toBe(1);
});

it("should not increase counter when status is 200ish", () => {
    expect(reduceErrors(0, 204)).toBe(0);
});
