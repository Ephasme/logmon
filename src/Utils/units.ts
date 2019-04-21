export interface ISeconds { sec: number; }
export interface IMilliseconds { ms: number; }

export const Sec: (i: number) => ISeconds = (i) => ({ sec: i });
export const Ms: (i: number) => IMilliseconds = (i) => ({ ms: i });

export function toMs(input: ISeconds): IMilliseconds {
    return { ms: input.sec * 1000 };
}

export function toSec(input: IMilliseconds): ISeconds {
    return { sec: input.ms / 1000 };
}
