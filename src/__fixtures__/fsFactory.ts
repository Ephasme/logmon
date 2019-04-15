import { IFileSystem, IStats } from "../FileSystem";

export interface IFileSystemFixtureFactory {
    makeStatic(): IFileSystem;
    makeNoFile(): IFileSystem;
}

export const factory: IFileSystemFixtureFactory = {
    makeStatic() {
        return {
            statSync(_: string): IStats {
                return {
                    size: 51,
                    mtimeMs: 120,
                };
            },
            existsSync: (_: string) => true,
        };
    },
    makeNoFile() {
        return {
            statSync(_: string): IStats {
                throw new Error("File does not exist.");
            },
            existsSync: (_: string) => false,
        };
    },
};
