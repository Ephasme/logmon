import { factory } from "../../../__fixtures__/fsFactory";
import { PollingFileWatcher } from "../../../FileSystem/PollingFileWatcher";

it("should throw when Polling value is less than zero", () => {
    expect(() => new PollingFileWatcher(factory.makeStatic(), "testfile", -51)).toThrow(/Invalid argument/);
});
