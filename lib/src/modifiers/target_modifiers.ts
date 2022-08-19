import { z } from "zod";
import { LogItem } from "../core/log_item";
import {
  finalApplyOneLine,
  OneLine_AllArgs,
  OneLine_AllArgsScheme,
} from "./target/one_line";

export type ProcessLog_Mod_TargetF = (
  log: LogItem,
  targetMeta: { [key: string]: any }
) => Promise<void>;

/**
 * A content modifiers that rely on knloedge of the targets (console, http etc.)
 */
export class TargetModifiers {
  /**
   * Short text to one line
   */
  oneLine?: OneLine_AllArgs;

  public static readonly scheme: z.ZodType<TargetModifiers> = z
    .object({
      oneLine: z.optional(OneLine_AllArgsScheme),
    })
    .strict();

  static fromObj(obj: any) {
    const result = TargetModifiers.scheme.parse(obj);
    return result;
  }
}

async function createRuntimeModifiersPipeline(
  obj: TargetModifiers
): Promise<ProcessLog_Mod_TargetF[]> {
  const result: ProcessLog_Mod_TargetF[] = [];

  if (obj.oneLine) result.push(await finalApplyOneLine(obj.oneLine));

  return result;
}
