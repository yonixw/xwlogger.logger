import { literal, TypeOf, z, ZodError } from "zod";
import { LogItem, ProcessLogF } from "../../core/log_item";
import { assertNever } from "../../utils/ts/unions";

/**
 * Specify count of parents to add to each log
 */
export class StackTop_Arg_ByCount {
  public readonly _: "top" = "top";

  /** Parent count to add */
  byCount: number = 1;

  public static readonly scheme: z.ZodType<StackTop_Arg_ByCount> = z
    .object({
      _: literal("top"),
      byCount: z
        .number()
        .int({ message: "Must be integer 1-10" })
        .min(1, { message: "Must be bigger than 0" })
        .max(10, { message: "Must be lower than 11" }),
    })
    .strict();
}

/**
 * Get stack info from top of stack
 */
export class StackTop_Arg_Auto {
  public readonly _: "auto" = "auto";

  public static readonly scheme: z.ZodType<StackTop_Arg_Auto> = z
    .object({
      _: literal("auto"),
    })
    .strict();
}

export type StackTop_AllArgs = StackTop_Arg_ByCount | StackTop_Arg_Auto;

export const StackTop_AllArgsScheme = z.union([
  StackTop_Arg_ByCount.scheme,
  StackTop_Arg_Auto.scheme,
]);

// print last lines from error  stacktrace
export const stacktrace = (
  stack?: string[],
  lines: number = 10,
  ignore = 2
): string => {
  if (!stack) {
    stack = (new Error().stack || "").split("\n");
    if (stack.length > ignore) {
      stack = stack.slice(ignore, stack.length - 1); // Error + this func
    }
  }

  const stacklist = stack.map((line) => line.replace(/^\s*at\s*/, ""));

  const stacktrace = stacklist.slice(0, lines);
  return stacktrace.join("\n");
};

async function addStack(log: LogItem, count: number) {
  log.suffixs.push(stacktrace(undefined, count, 2));
}

export async function finalApplyStackTop(stackTop: Required<StackTop_AllArgs>) {
  let result: ProcessLogF = () => Promise.resolve();
  switch (stackTop._) {
    case "top":
      result = (log: LogItem) => addStack(log, stackTop.byCount);
      break;
    case "auto":
      result = (log: LogItem) => addStack(log, 1);
      break;
    default:
      return assertNever(stackTop);
  }
  return result;
}
