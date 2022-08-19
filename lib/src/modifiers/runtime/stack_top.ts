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

async function addStack(log: LogItem, count: number) {
  log.suffixs.push(new Error().stack || "stack is not available");
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
