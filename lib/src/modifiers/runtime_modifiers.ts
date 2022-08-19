import { z } from "zod";
import { ProcessLogF } from "../core/log_item";
import {
  finalApplyStackTop,
  StackTop_AllArgs,
  StackTop_AllArgsScheme,
} from "./runtime/stack_top";

export type metamodifiers =
  | "smart.mask" // env + every 6 and keep whitespaces A,a,0
  | "mask.every=="
  | "mask.boundry=="
  | "gmt=="
  | "full.time"
  | "hmsm.time"
  | "dmy.date"
  //
  | "no.color"
  | "max.cols=="
  | "oneline.tart"
  | "oneline.end"
  | "oneline.mid"
  | "line.num"
  //
  | "delta"
  | "parent.delta"
  | "eval.args==" // azAz_09 only
  | "filename"
  | "name.args" // not in arrow
  | "stack.top=="; // @todo consider WebWorker case, need to be calc on log call side

/**
 * A modifier directive options
 */
export class RuntimeModifiers {
  /**
   *  Add call stack info
   */
  stackTop?: StackTop_AllArgs = undefined;

  public static readonly scheme: z.ZodType<RuntimeModifiers> = z
    .object({
      stackTop: StackTop_AllArgsScheme,
    })
    .strict();

  static fromObj(obj: any) {
    const result = RuntimeModifiers.scheme.parse(obj);
    return result;
  }
}

async function createRuntimeModifiersPipeline(
  obj: RuntimeModifiers
): Promise<ProcessLogF[]> {
  const result: ProcessLogF[] = [];

  if (obj.stackTop) result.push(await finalApplyStackTop(obj.stackTop));

  return result;
}
