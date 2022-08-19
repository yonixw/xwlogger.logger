import { LogItem } from "../../core/log_item";
import { ProcessLog_Mod_RuntimeF } from "../runtime_modifiers";
import {
  finalApplyStackTop,
  StackTop_AllArgs,
  StackTop_AllArgsScheme,
  stacktrace,
} from "./stack_top";

async function parentX(d: ProcessLog_Mod_RuntimeF, log: LogItem) {
  await d(log);
}

describe("StackTop", () => {
  test("stacktrace core", async () => {
    const stack = stacktrace(undefined, 10, 1).split("\n");

    expect(stack.length).toBeLessThanOrEqual(10);
    expect(stack[0].indexOf("test.ts")).toBeGreaterThan(0);

    // If we give our own, extra line of "Error:"
    const stackList2 = stacktrace(new Error().stack?.split("\n"), 10, 1).split(
      "\n"
    );
    expect(stackList2[0].indexOf(".test.ts")).toBeGreaterThan(0);
  });

  test("auto", async () => {
    const logItem = new LogItem();

    const resultXYZ = await finalApplyStackTop(
      StackTop_AllArgsScheme.parse({
        _: "auto",
      } as StackTop_AllArgs)
    );

    await resultXYZ(logItem);

    expect(logItem.suffixs.length).toBe(1);
    expect(logItem.suffixs[0].indexOf("result")).toBeGreaterThan(-1);
  });

  test("multiline 1 level", async () => {
    const logItem = new LogItem();

    const count = 100;

    const result = await finalApplyStackTop(
      StackTop_AllArgsScheme.parse({
        _: "top",
        byCount: count,
      } as StackTop_AllArgs)
    );

    await result(logItem);

    // 1 because we are top callers

    expect(logItem.suffixs[0].split("\n").length).toBeLessThan(count);
    expect(logItem.suffixs[0].length).toBeGreaterThanOrEqual(5);
    expect(logItem.suffixs[0].indexOf("result")).toBeGreaterThan(-1);
  });

  test("multiline 2 levels", async () => {
    const logItem = new LogItem();

    const count = 100;

    const result = await finalApplyStackTop(
      StackTop_AllArgsScheme.parse({
        _: "top",
        byCount: count,
      } as StackTop_AllArgs)
    );

    await parentX(result, logItem);

    // 1 because we are top callers
    expect(logItem.suffixs[0].split("\n").length).toBeLessThan(count);
    expect(logItem.suffixs[0].split("\n").length).toBeGreaterThanOrEqual(2);
    expect(logItem.suffixs[0].indexOf("stack_top.test.ts")).toBeGreaterThan(-1);
    expect(logItem.suffixs[0].indexOf("parentX")).toBeGreaterThan(-1);

    console.log(logItem.suffixs[0]);
  });
});
