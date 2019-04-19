import { factory } from "../../../__fixtures__/fsFactory";
import { IFileSystem } from "../../../FileSystem";
import { PollingFileWatcher } from "../../../FileSystem/PollingFileWatcher";

jest.useFakeTimers();

it("should not call onChange when timing is wrong", () => {
    const fakedStatSync = jest.fn().mockImplementation(factory.makeStatic().statSync);
    const onChange = jest.fn();

    const fakeFs: IFileSystem = {
        statSync: fakedStatSync,
        existsSync: (_) => true,
    };

    const watcher = new PollingFileWatcher(fakeFs, "testfile");

    watcher.watch(onChange);
    jest.advanceTimersByTime(1000);

    expect(fakedStatSync).toBeCalledTimes(2);
    expect(onChange).toBeCalledTimes(1);
});

it("should call statsSync on filename", () => {
    const fakedStatSync = jest.fn().mockImplementation(factory.makeStatic().statSync);
    const fakeFs: IFileSystem = {
        statSync: fakedStatSync,
        existsSync: (_) => true,
    };

    const watcher = new PollingFileWatcher(fakeFs, "testfile");
    watcher.watch(jest.fn());
    expect(fakedStatSync).toBeCalled();
});

it("should return the correct size from stats", () => {
    const watcher = new PollingFileWatcher(factory.makeStatic(), "testfile");
    const faked = jest.fn();
    watcher.watch(faked);
    expect(faked).toBeCalledWith({ mtimeMs: 120, size: 51 }, "testfile");
});

it("should return the correct mtimeMs from stats", () => {
    const watcher = new PollingFileWatcher(factory.makeStatic(), "testfile");
    const faked = jest.fn();
    watcher.watch(faked);
    expect(faked).toBeCalledWith({ mtimeMs: 120, size: 51 }, "testfile");
});

it("should not throw when file does not exist", () => {
    const watcher = new PollingFileWatcher(factory.makeNoFile(), "testfile");
    const faked = jest.fn();
    expect(() => watcher.watch(faked)).not.toThrow();
});

it("should tick every seconds by default", () => {
    const stub : IFileSystem = {
        existsSync: jest.fn()
            .mockReturnValue(true),
        statSync: jest.fn()
            .mockReturnValueOnce({
                size: 51,
                mtimeMs: 120,
            })
            .mockReturnValueOnce({
                size: 151,
                mtimeMs: 150,
            })
            .mockReturnValueOnce({
                size: 251,
                mtimeMs: 180,
            }),
    };

    const watcher = new PollingFileWatcher(stub, "testfile");
    const faked = jest.fn();
    watcher.watch(faked);
    jest.advanceTimersByTime(2000);
    expect(faked).toBeCalledTimes(3);
});
