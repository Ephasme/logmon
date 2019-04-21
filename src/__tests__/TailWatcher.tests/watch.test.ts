import { BlockReader, IFileWatcher, IStats } from "../../FileSystem";
import { TailWatcher } from "../../TailWatcher";

it("should call watch of FileWatcher", () => {
    const mockBlockReader: BlockReader = jest.fn();
    const fakeWatch = jest.fn();
    const mockFileWatcher: IFileWatcher = {
        watch: (onChange: (stats: IStats, filename: string) => void) => {
            onChange({ mtimeMs: 15, size: 41 }, "bla");
            onChange({ mtimeMs: 17, size: 54 }, "bla");
        },
    };
    const tw = new TailWatcher(mockFileWatcher, mockBlockReader);
    tw.watch(fakeWatch);
    expect(mockBlockReader).toHaveBeenCalledWith("bla", {start: 0, end: 41}, fakeWatch);
    expect(mockBlockReader).toHaveBeenCalledWith("bla", {start: 41, end: 54}, fakeWatch);
});

it("should not call watch of FileWatcher if size shrinked", () => {
    const mockBlockReader: BlockReader = jest.fn();
    const fakeWatch = jest.fn();
    const mockFileWatcher: IFileWatcher = {
        watch: (onChange: (stats: IStats, filename: string) => void) => {
            onChange({ mtimeMs: 15, size: 41 }, "bla");
            onChange({ mtimeMs: 17, size: 12 }, "bla");
            onChange({ mtimeMs: 17, size: 13 }, "bla");
        },
    };
    const tw = new TailWatcher(mockFileWatcher, mockBlockReader);
    tw.watch(fakeWatch);
    expect(mockBlockReader).toHaveBeenCalledWith("bla", {start: 0, end: 41}, fakeWatch);
    expect(mockBlockReader).toHaveBeenCalledWith("bla", {start: 12, end: 13}, fakeWatch);
});
