import { LogWatcher} from "../../LogWatcher/LogWatcher";
import { ITailWatcher } from "../../TailWatcher";
import { generateLogLine } from "../../__fixtures__/logLineFactory";
import moment = require("moment");

it("should call watch from TailWatcher", () => {
    const fakeWatch = jest.fn();
    const mockTailWatcher: ITailWatcher = {
        watch: fakeWatch,
    };
    const now = moment();
    const w = new LogWatcher(_ => generateLogLine(), mockTailWatcher, now.toDate());
    w.watch(fakeWatch);
    expect(fakeWatch).toBeCalledTimes(1);
});

it("should ignore logs older than starting time", () => {
    const fakeWatch = jest.fn().mockImplementation((fn: any) => {
        fn("coucou");
    });
    const now = moment();
    const fakeLogHandler = jest.fn();
    const mockTailWatcher: ITailWatcher = {
        watch: fakeWatch,
    };
    const w = new LogWatcher(_ => generateLogLine(), mockTailWatcher, now.add(1, "h").toDate());
    w.watch(fakeLogHandler);
    expect(fakeLogHandler).toBeCalledTimes(0);
});

it("should call log handler when log is given", () => {
    const fakeWatch = jest.fn().mockImplementation((fn: any) => {
        fn("coucou");
    });
    const now = moment();
    const fakeLogHandler = jest.fn();
    const mockTailWatcher: ITailWatcher = {
        watch: fakeWatch,
    };
    const w = new LogWatcher(_ => generateLogLine(), mockTailWatcher, now.subtract(1, "s").toDate());
    w.watch(fakeLogHandler);
    expect(fakeLogHandler).toBeCalledTimes(1);
});

it("should not call log handler when not log is given", () => {
    const fakeWatch = jest.fn().mockImplementation((fn: any) => {
        fn("coucou");
    });
    const now = moment();
    const fakeLogHandler = jest.fn();
    const mockTailWatcher: ITailWatcher = {
        watch: fakeWatch,
    };
    const w = new LogWatcher((_) => null, mockTailWatcher, now.toDate());
    w.watch(fakeLogHandler);
    expect(fakeLogHandler).not.toBeCalled();
});
