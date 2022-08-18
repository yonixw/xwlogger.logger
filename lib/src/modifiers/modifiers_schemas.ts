import { TypeOf, z, ZodError } from "zod";

export type metamodifiers =
  | "gmt=="
  | "full.time"
  | "hmsm.time"
  | "dmy.date"
  | "delta"
  | "parent.delta"
  | "line.num"
  | "no.color"
  | "mask.every=="
  | "mask.bound=="
  | "smart.mask" // env + every 6 and keep whitespaces A,a,0
  | "oneline.tart"
  | "oneline.end"
  | "oneline.mid"
  | "eval.args==" // azAz_09 only
  | "name.args" // not in arrow
  | "stack.top==" // @todo consider WebWorker case, need to be calc on log call side
  | "max.cols==";

/**
 * Specify count of parents to add to each log
 */
export class StackTop_ByCount {
  /** Parent count to add */
  byCount: number = 1;

  public static readonly scheme: z.ZodType<StackTop_ByCount> = z
    .object({
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
 * @remarks empty object (`{}`)
 */
export class StackTop_Auto {
  public static readonly scheme: z.ZodType<StackTop_Auto> = z
    .object({})
    .strict();
}

/**
 * A modifier directive options
 */
export class TargetModifiers {
  /**
   *  Add call stack info
   */
  stackTop?: StackTop_ByCount | StackTop_Auto = undefined;

  public static readonly scheme: z.ZodType<TargetModifiers> = z
    .object({
      stackTop: z.optional(StackTop_Auto.scheme).or(StackTop_ByCount.scheme),
    })
    .strict();

  static fromObj(obj: any) {
    const result = TargetModifiers.scheme.parse(obj);
    return result;
  }
}
