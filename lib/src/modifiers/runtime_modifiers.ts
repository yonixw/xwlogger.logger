import { z } from "zod";
import { LogItem } from "../core/log_item";
import {
  finalApplyStackTop,
  StackTop_AllArgs,
  StackTop_AllArgsScheme,
} from "./runtime/stack_top";

export type metamodifiers =
  // `Content`,  (only need to see content)
  | "smart.mask" // env + every 6 and keep whitespaces A,a,0
  | "mask.every=="
  | "mask.boundry=="
  | "gmt=="
  | "full.time"
  | "hmsm.time"
  | "dmy.date"
  // `Targets` (need target object)
  | "no.color"
  | "max.cols=="
  | "oneline.tart"
  | "oneline.end"
  | "oneline.mid"
  | "line.num"
  // `Runtime` (need conenction to original stack)
  | "delta"
  | "parent.delta"
  | "eval.args==" // azAz_09 only
  | "unsoppurted.filename" // NO! stack is really tricky to navigate... don't want to be liable to ES tricks
  | "name.args" // not in arrow
  | "stack.top=="; // @todo consider WebWorker case, need to be calc on log call side

export type ProcessLog_Mod_RuntimeF = (log: LogItem) => Promise<void>;

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
      stackTop: z.optional(StackTop_AllArgsScheme),
    })
    .strict();

  static fromObj(obj: any) {
    const result = RuntimeModifiers.scheme.parse(obj);
    return result;
  }
}

async function createRuntimeModifiersPipeline(
  obj: RuntimeModifiers
): Promise<ProcessLog_Mod_RuntimeF[]> {
  const result: ProcessLog_Mod_RuntimeF[] = [];

  if (obj.stackTop) result.push(await finalApplyStackTop(obj.stackTop));

  return result;
}
