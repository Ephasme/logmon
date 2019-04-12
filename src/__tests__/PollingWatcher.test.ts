import "jest";
import * as sinon from "sinon";
import { IFileSystem } from "../FileSystem/IFileSystem";
import { IStats } from "../FileSystem/IStats";
import { PollingWatcher } from "../Watcher/PollingWatcher";

const fakeStaticFs: IFileSystem = {
    statSync(_: string): IStats {
        return {
            size: 51,
            mtimeMs: 120,
        };
    },
};

const clock = sinon.useFakeTimers();

beforeEach(clock.reset);

it("should not call onChange when timing is wrong", () => {
    const fakedStatSync = sinon.fake(fakeStaticFs.statSync);
    const onChange = sinon.fake();
    const fakeFs: IFileSystem = {
        statSync: fakedStatSync,
    };

    const watcher = new PollingWatcher(fakeFs, "testfile");

    watcher.watch(onChange);
    clock.tick(1000);

    expect(fakedStatSync.callCount).toBe(2);
    expect(onChange.callCount).toBe(1);
});

it("should call statsSync on filename", () => {
    const fakedStatSync = sinon.fake(fakeStaticFs.statSync);
    const fakeFs: IFileSystem = {
        statSync: fakedStatSync,
    };

    const watcher = new PollingWatcher(fakeFs, "testfile");
    watcher.watch(sinon.fake());
    expect(fakedStatSync.called).toBeTruthy();
});

it("should return the correct size from stats", () => {
    const watcher = new PollingWatcher(fakeStaticFs, "testfile");
    const faked = sinon.fake();
    watcher.watch(faked);
    expect(faked.calledWith({ size: 51 }));
});

it("should return the correct mtimeMs from stats", () => {
    const watcher = new PollingWatcher(fakeStaticFs, "testfile");
    const faked = sinon.fake();
    watcher.watch(faked);
    expect(faked.calledWith({ mtimeMs: 120 }));
});

it("should tick every seconds by default", () => {
    const stub = sinon.stub(fakeStaticFs);

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

    const watcher = new PollingWatcher(stub, "testfile");
    const faked = sinon.fake();
    watcher.watch(faked);
    clock.tick(2000);
    expect(faked.callCount).toBe(3);
});
