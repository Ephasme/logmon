import { LoadState, defaultLoadStateFactory } from "./load/states";

export type RootState = Readonly<{
    alert: LoadState;
}>;

export const defaultStateFactory: () => RootState = () => ({
    alert: defaultLoadStateFactory(),
});
