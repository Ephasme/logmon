import { TimerMonitor } from "../../TimerMonitor";
import { generateLogLine } from "../../__fixtures__/logLineFactory";

jest.useFakeTimers();

it("should call the watcher with successive batches", () => {
    var timerMonitor = new TimerMonitor(10);

    const firstBatch = [
        generateLogLine(),
        generateLogLine(),
    ];
    const secondBatch = [
        generateLogLine(),
        generateLogLine(),
    ];

    for (const log of firstBatch) {
        timerMonitor.onLog(log);
    }
    const mockOnBatch = jest.fn();
    
    timerMonitor.run(mockOnBatch);
    for (const log of secondBatch) {
        timerMonitor.onLog(log);
    }
    jest.advanceTimersByTime(10);

    expect(mockOnBatch)
        .toHaveBeenNthCalledWith(1, firstBatch);
    expect(mockOnBatch)
        .toHaveBeenNthCalledWith(2, secondBatch);
});
