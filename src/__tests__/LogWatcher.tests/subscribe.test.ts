import { LogWatcher} from "../../LogWatcher/LogWatcher";
import { ITailWatcher } from "../../TailWatcher/ITailWatcher";

it("should add subscriber", () => {
    const fakeTailWatcher: ITailWatcher = {
        watch: jest.fn(),
    };
    const w = new LogWatcher(() => null, fakeTailWatcher);

    expect(() => w.subscribe(jest.fn())).not.toThrow();
});