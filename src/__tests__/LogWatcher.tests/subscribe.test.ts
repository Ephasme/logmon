import { LogWatcher} from "../../LogWatcher/LogWatcher";
import { ITailWatcher } from "../../TailWatcher/ITailWatcher";

it("should add subscriber", () => {
    const fakeTailWatcher: ITailWatcher = {
        watch: jest.fn(),
    };
    const w = new LogWatcher(fakeTailWatcher);

    expect(() => w.subscribe(jest.fn())).not.toThrow();
});

it("should throw if subscriber is null", () => {
    const fakeTailWatcher: ITailWatcher = {
        watch: jest.fn(),
    };
    const w = new LogWatcher(fakeTailWatcher);

    expect(() => w.subscribe(null)).toThrow();
});
