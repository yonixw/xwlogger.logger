import { stacktrace } from "./stack_top";

describe("StackTop", () => {
  test("stacktrace core", () => {
    const stack = stacktrace().split("\n");
    expect(stack.length).toBeLessThanOrEqual(10);
    expect(stack[0].indexOf("test.ts")).toBeGreaterThan(0);

    // If we give our own, extra line of "Error:"
    const stackList2 = stacktrace((new Error().stack || "").split("\n")).split(
      "\n"
    );
    expect(stackList2[1].indexOf("test.ts")).toBeGreaterThan(0);
  });
});
