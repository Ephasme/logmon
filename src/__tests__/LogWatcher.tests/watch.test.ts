import { LogWatcher} from "../../LogWatcher/LogWatcher";
import { FactoryFunction } from "../../Models/LogLineFactory";
import { ITailWatcher } from "../../TailWatcher/ITailWatcher";

const mockFactoryFunction: FactoryFunction = (_) => {
    return {
        domain: "domain",
        duration: 123,
        httpResultCode: 200,
        hyphen: "-",
        request: {
            httpAction: "GET",
            protocol: "HTTP/1.0",
            routeSegments: ["group1", "cxbvcsgreyutr"],
        },
        time: new Date(2018, 5, 5, 13, 43, 12, 123),
        userid: "userid",
    };
};

it("should call watch from TailWatcher", () => {
    const fakeWatch = jest.fn();
    const mockTailWatcher: ITailWatcher = {
        watch: fakeWatch,
    };
    const w = new LogWatcher(mockFactoryFunction, mockTailWatcher);
    w.watch();
    expect(fakeWatch).toBeCalledTimes(1);
});

it("should call log handler when log is given", () => {
    const fakeWatch = jest.fn().mockImplementation((fn: any) => {
        fn("coucou");
    });
    const fakeLogHandler = jest.fn();
    const mockTailWatcher: ITailWatcher = {
        watch: fakeWatch,
    };
    const w = new LogWatcher(mockFactoryFunction, mockTailWatcher);
    w.subscribe(fakeLogHandler);
    w.watch();
    expect(fakeLogHandler).toBeCalledTimes(1);
});

it("should not call log handler when not log is given", () => {
    const fakeWatch = jest.fn().mockImplementation((fn: any) => {
        fn("coucou");
    });
    const fakeLogHandler = jest.fn();
    const mockTailWatcher: ITailWatcher = {
        watch: fakeWatch,
    };
    const w = new LogWatcher((_) => null, mockTailWatcher);
    w.subscribe(fakeLogHandler);
    w.watch();
    expect(fakeLogHandler).not.toBeCalled();
});
