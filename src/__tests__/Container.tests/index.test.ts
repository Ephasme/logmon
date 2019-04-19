import * as mock from "mock-fs";
import { kernel } from "../../Container/index";

beforeAll(() => {
    mock({
        "/some/path": {
            "somefile.txt": "file content",
        },
    });
});

afterAll(() => {
    mock.restore();
});

it("should not be null", () => {
    expect(kernel).not.toBeNull();
});

it("should be able to create a log watcher with a valid file", () => {
    expect(() => kernel.createLogWatcher("/some/path/somefile.txt")).not.toThrow();
});

it("should be able to create a main reducer with a valid file", () => {
    expect(() => kernel.createMainReducer()).not.toThrow();
})

it("should be able to create a timer monitor with a valid file", () => {
    expect(() => kernel.createTimerMonitor(15)).not.toThrow();
})

it("should be able to create a gui without a valid file", () => {
    expect(() => kernel.createGui()).not.toThrow();
});
