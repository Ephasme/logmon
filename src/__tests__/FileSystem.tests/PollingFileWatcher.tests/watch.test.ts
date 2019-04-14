import "jest";
import * as sinon from "sinon";
import { factory } from "../../../__fixtures__/fsFactory";
import { IFileSystem } from "../../../FileSystem/IFileSystem";
import { PollingFileWatcher } from "../../../FileSystem/PollingFileWatcher";

const clock = sinon.useFakeTimers();

it("should throw when onChange is null", () => {
    const watcher = new PollingFileWatcher(factory.makeStatic(), "testfile");
    expect(() => watcher.watch(null)).toThrow(/Argument null/);
});

it("should not call onChange when timing is wrong", () => {
    const fakedStatSync = sinon.fake(factory.makeStatic().statSync);
    const onChange = sinon.fake();

    const fakeFs: IFileSystem = {
        statSync: fakedStatSync,
    };

    const watcher = new PollingFileWatcher(fakeFs, "testfile");

    watcher.watch(onChange);
    clock.tick(1000);

    expect(fakedStatSync.callCount).toBe(2);
    expect(onChange.callCount).toBe(1);
});

it("should call statsSync on filename", () => {
    const fakedStatSync = sinon.fake(factory.makeStatic().statSync);
    const fakeFs: IFileSystem = {
        statSync: fakedStatSync,
    };

    const watcher = new PollingFileWatcher(fakeFs, "testfile");
    watcher.watch(sinon.fake());
    expect(fakedStatSync.called).toBeTruthy();
});

it("should return the correct size from stats", () => {
    const watcher = new PollingFileWatcher(factory.makeStatic(), "testfile");
    const faked = sinon.fake();
    watcher.watch(faked);
    expect(faked.calledWith({ size: 51 }));
});

it("should return the correct mtimeMs from stats", () => {
    const watcher = new PollingFileWatcher(factory.makeStatic(), "testfile");
    const faked = sinon.fake();
    watcher.watch(faked);
    expect(faked.calledWith({ mtimeMs: 120 }));
});

it("should tick every seconds by default", () => {
    const stub = sinon.stub(factory.makeStatic());

    stub.statSync.onCall(0).returns({
        size: 51,
        mtimeMs: 120,
    });
    stub.statSync.onCall(1).returns({
        size: 151,
        mtimeMs: 150,
    });
    stub.statSync.onCall(2).returns({
        size: 251,
        mtimeMs: 180,
    });

    const watcher = new PollingFileWatcher(stub, "testfile");
    const faked = sinon.fake();
    watcher.watch(faked);
    clock.tick(2000);
    expect(faked.callCount).toBe(3);
});
