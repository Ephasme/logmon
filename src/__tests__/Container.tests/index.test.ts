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

it("should be able to create a log watcher without a valid file", () => {
    expect(() => kernel.createLogWatcher("any")).not.toThrow();
});

it("should have property allowing log watcher creation", () => {
    expect(kernel).toHaveProperty("createLogWatcher");
});
