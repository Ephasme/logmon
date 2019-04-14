import { factory } from "../../../__fixtures__/fsFactory";
import { PollingFileWatcher } from "../../../FileSystem/PollingFileWatcher";

it("should throw when IFileSystem is null", () => {
    expect(() => new PollingFileWatcher(null, "testfile")).toThrow(/Argument null/);
});

it("should throw when File Name is null", () => {
    expect(() => new PollingFileWatcher(factory.makeStatic(), null)).toThrow(/Argument null/);
});

it("should throw when Polling value is less than zero", () => {
    expect(() => new PollingFileWatcher(factory.makeStatic(), "testfile", -51)).toThrow(/Invalid argument/);
});
