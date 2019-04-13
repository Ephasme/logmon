import { IFileSystem, IStats } from "../FileSystem";

export interface IFileSystemFixtureFactory {
    makeStatic(): IFileSystem;
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
        };
    },
};
