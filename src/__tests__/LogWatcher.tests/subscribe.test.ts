import { LogWatcher} from "../../LogWatcher/LogWatcher";
import { ITailWatcher } from "../../TailWatcher/ITailWatcher";
import { ILogLine } from "../../Models/ILogLine";

it("should add subscriber", () => {
    const fakeTailWatcher: ITailWatcher = {
        watch: jest.fn(),
    };
    const w = new LogWatcher(() => null, fakeTailWatcher);

    expect(() => w.subscribe(jest.fn())).not.toThrow();
});

it("should add subscriber", () => {
    const fakeTailWatcher: ITailWatcher = {
        watch: jest.fn(),
    };
    const w = new LogWatcher(() => null, fakeTailWatcher);

    const fn: {
        onLog: (log: ILogLine) => void,
    } = {
        onLog: jest.fn(),
    };

    expect(() => w.subscribe(fn)).not.toThrow();
});
