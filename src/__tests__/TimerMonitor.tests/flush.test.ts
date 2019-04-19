import { TimerMonitor } from "../../TimerMonitor";
import { ILogWatcher, ILogLine } from "../../LogWatcher";
import { generateLogLine } from "../../__fixtures__/logLineFactory";

it("should return the number of elements at the flush moment", () => {
    let handler: (log: ILogLine) => void = () => {
        throw new Error();
    };
    
    const mockLogWatcher: ILogWatcher = {
       watch: (onLog: (log: ILogLine) => void) => {
            handler = onLog;
       },
    }
    const timerMonitor = new TimerMonitor(mockLogWatcher);
    timerMonitor.watch();

    if (handler) {
        const i1e = generateLogLine(); handler(i1e);
        const i2e = generateLogLine(); handler(i2e);
        const i3e = generateLogLine(); handler(i3e);
        const i4e = generateLogLine(); handler(i4e);

        const flush = timerMonitor.flush();

        const i1 = flush.next().value; expect(i1).toBe(i1e);
        const i2 = flush.next().value; expect(i2).toBe(i2e);

        handler(generateLogLine());
        handler(generateLogLine());
        handler(generateLogLine());

        const i3 = flush.next().value; expect(i3).toBe(i3e);
        const i4 = flush.next().value; expect(i4).toBe(i4e);
        
        expect(flush.next().done).toBeTruthy();
    } else {
        fail();
    }
});