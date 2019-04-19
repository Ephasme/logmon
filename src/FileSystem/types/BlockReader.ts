import { IBlock } from "./IBlock";

export type BlockReader = (filename: string, block: IBlock, onLog: (data: string) => void) => void;
