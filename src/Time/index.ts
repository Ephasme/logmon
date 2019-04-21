export type TimeProvider = () => Date;

export const getNow: TimeProvider = () => new Date();