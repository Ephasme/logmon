export type Seconds = { sec: number; }
export type Milliseconds = { ms: number; }

export const Sec: (i: number) => Seconds = (i) => ({ sec: i });
export const Ms: (i: number) => Milliseconds = (i) => ({ ms: i });

export function toMs(input: Seconds): Milliseconds {
    return { ms: input.sec * 1000 }
}

export function toSec(input: Milliseconds): Seconds {
    return { sec: input.ms / 1000 };
}