import { TailWatcher } from "../../TailWatcher";
import { IFileWatcher, BlockReader, IStats } from "../../FileSystem";
import { IBlock } from "../../FileSystem/IBlock";

it("should call watch of FileWatcher", () => {
    const mockBlockReader: BlockReader = jest.fn();
    const fakeWatch = jest.fn()
    const mockFileWatcher: IFileWatcher = {
        watch: (onChange: (stats: IStats, filename: string) => void) => {
            onChange({ mtimeMs: 15, size: 41 }, "bla");
            onChange({ mtimeMs: 17, size: 54 }, "bla");
        },
    }
    var tw = new TailWatcher(mockFileWatcher, mockBlockReader);
    tw.watch(fakeWatch);
    expect(mockBlockReader).toHaveBeenCalledWith("bla", {start: 0, end: 40}, fakeWatch);
    expect(mockBlockReader).toHaveBeenCalledWith("bla", {start: 41, end: 53}, fakeWatch);
});