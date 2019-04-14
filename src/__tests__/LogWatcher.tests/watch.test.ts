import { LogWatcher} from "../../LogWatcher/LogWatcher";
import { ITailWatcher } from "../../TailWatcher/ITailWatcher";

it("should call watch from TailWatcher", () => {
    const fakeWatch = jest.fn();
    const fakeTailWatcher: ITailWatcher = {
        watch: fakeWatch,
    };
    const w = new LogWatcher(fakeTailWatcher);

    w.watch();

    expect(fakeWatch).toBeCalledTimes(1);
});
