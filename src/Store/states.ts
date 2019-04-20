import { AlertState, defaultAlertStateFactory } from "./alert/states";

export type RootState = Readonly<{
    alert: AlertState;
}>;

export const defaultStateFactory: () => RootState = () => ({
    alert: defaultAlertStateFactory(),
});
