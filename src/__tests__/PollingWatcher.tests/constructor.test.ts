import { factory } from "../../__fixtures__/fsFactory";
import { PollingWatcher } from "../../Watcher";

it("should throw when IFileSystem is null", () => {
    expect(() => new PollingWatcher(null, "testfile")).toThrow(/Argument null/);
});

it("should throw when File Name is null", () => {
    expect(() => new PollingWatcher(factory.makeStatic(), null)).toThrow(/Argument null/);
});

it("should throw when Polling value is less than zero", () => {
    expect(() => new PollingWatcher(factory.makeStatic(), "testfile", -51)).toThrow(/Invalid argument/);
});
