import { literal, z } from "zod";
import { LogItem, ProcessLogF } from "../../core/log_item";
import { assertNever } from "../../utils/ts/unions";

// =========================================
// ============= [1/3] Argument Schems
// =========================================

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
        .max(100, { message: "Must be lower than 11" }),
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

// =========================================
// ============= [2/3] Core Code
// =========================================

/**
 *  print last lines from error  stacktrace
 * @param stack Give lines of your own, or empty for calculating
 * @param linesToLoad Need to be big number since we filter it down
 * @param ignore How much to ignore after filtering
 * @param linesToReport How much to report after filter + ignore
 * @returns
 */
export const stacktrace = (
  stack?: string[],
  linesToLoad: number = 100,
  ignore = 2,
  linesToReport = 10
): string => {
  let orgStack = stack || [];
  if (!stack) {
    const _old_error_max = Error.stackTraceLimit;
    Error.stackTraceLimit = linesToLoad;
    orgStack = (new Error().stack || "").split("\n");
    stack = orgStack
      // Remove old es middlemans (for async etc...)
      .filter((e) => !e.endsWith("<anonymous>)"))
      .filter((e) => e.indexOf("Object.<anonymous>.__awaiter") == -1)
      .filter((e) => e.indexOf(" (") > -1);
    Error.stackTraceLimit = _old_error_max;
  }
  if (stack.length > ignore) {
    stack = stack.slice(ignore, stack.length - 1); // Error + this func
  }

  const stacklist = stack.map((line) => line.replace(/^\s*at\s*/, ""));

  const stacktrace = stacklist.slice(0, linesToReport);
  return stacktrace.join("\n");
};

async function addStack(log: LogItem, count: number) {
  log.suffixs.push(stacktrace(undefined, 100, 2, count)); // remove the helpers, magic number because promises
}

// =========================================
// ============= [3/3] Argument handling
// =========================================

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
