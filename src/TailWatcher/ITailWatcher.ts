export interface ITailWatcher {
    watch(onData: (data: string) => void): void;
}
