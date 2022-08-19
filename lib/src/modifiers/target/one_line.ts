import { literal, z } from "zod";
import { LogItem } from "../../core/log_item";
import { assertNever } from "../../utils/ts/unions";

import { ShortBool, ShortBool_scheme, shortT } from "../../utils/ts/myTypes";
import { ProcessLog_Mod_TargetF } from "../target_modifiers";
import {
  KnownConsoleProperties,
  KnownConsoleProperties_Enum,
} from "../../targets/console";

// =========================================
// ============= [1/3] Argument Schems
// =========================================

/**
 * Short each message to one line by absolute number of characters
 */
export class OneLine_Arg_ByAbsMode {
  public readonly _: "N" = "N";

  /** Keep the start and short the end? */
  start?: ShortBool = 0;

  /** Keep the end and short the start? */
  end?: ShortBool = 1;

  /** Maximum absolute number of characters */
  toKeep: number = 1;

  public static readonly scheme: z.ZodType<OneLine_Arg_ByAbsMode> = z
    .object({
      _: literal("N"),
      start: z.optional(ShortBool_scheme),
      end: z.optional(ShortBool_scheme).default(1),
      toKeep: z
        .number()
        .min(1, { message: "Must be bigger than 1" })
        .int({ message: "Must be integer" }),
    })
    .strict();
}

/**
 * Short each message to one line by screen width number of characters precent
 */
export class OneLine_Arg_ByPercMode {
  public readonly _: "%" = "%";

  /** Keep the start and short the end? */
  start?: ShortBool = 0;

  /** Keep the end and short the start? */
  end?: ShortBool = 1;

  /** Maximum percent number of characters */
  toKeep: number = 1;

  public static readonly scheme: z.ZodType<OneLine_Arg_ByPercMode> = z
    .object({
      _: literal("%"),
      start: z.optional(ShortBool_scheme),
      end: z.optional(ShortBool_scheme).default(1),
      toKeep: z
        .number()
        .min(1, { message: "Must be bigger than 1" })
        .int({ message: "Must be integer" }),
    })
    .strict();
}

/**
 * Short each message to one line with default settings
 */
export class OneLine_Arg_Auto {
  public readonly _: "_" = "_";

  public static readonly scheme: z.ZodType<OneLine_Arg_Auto> = z
    .object({
      _: literal("_"),
    })
    .strict();
}

export type OneLine_AllArgs =
  | OneLine_Arg_ByAbsMode
  | OneLine_Arg_ByPercMode
  | OneLine_Arg_Auto;

export const OneLine_AllArgsScheme = z.union([
  OneLine_Arg_ByAbsMode.scheme,
  OneLine_Arg_ByPercMode.scheme,
  OneLine_Arg_Auto.scheme,
]);

// =========================================
// ============= [2/3] Core Code
// =========================================

/**
 * show last n chars at the end of astring with elipsis
 */
export const ellipsisStart = (astring: string, n: number): string => {
  n = n - 3;
  const len = astring.length;
  const start = Math.max(len - n, 0);
  const end = len;
  const ellipsis = "..." + astring.slice(start, end);
  return ellipsis;
};

/**
 * show first n chars at the start of astring with elipsis
 */
export const ellipsisEnd = (astring: string, n: number): string => {
  n = n - 3;
  const len = astring.length;
  const start = 0;
  const end = Math.min(n, len);
  const ellipsis = astring.slice(start, end) + "...";
  return ellipsis;
};

// =========================================
// ============= [3/3] Argument handling
// =========================================

const defaultNumber = 25;
const widthMetaKey =
  KnownConsoleProperties[KnownConsoleProperties_Enum.VISIBLE_WIDTH];

export async function finalApplyOneLine(oneLine: NonNullable<OneLine_AllArgs>) {
  let result: ProcessLog_Mod_TargetF = () => Promise.resolve();
  switch (oneLine._) {
    case "_":
      result = async (log: LogItem) => {
        log.baseMessage = ellipsisStart(log.baseMessage, defaultNumber);
      };
      break;
    case "N":
      const _toKeep_N = oneLine.toKeep;
      if (shortT(oneLine.start)) {
        result = async (log: LogItem) => {
          log.baseMessage = ellipsisStart(log.baseMessage, _toKeep_N);
        };
      } else {
        result = async (log: LogItem) => {
          log.baseMessage = ellipsisEnd(log.baseMessage, _toKeep_N);
        };
      }
      break;
    case "%":
      const _toKeep_P = oneLine.toKeep;
      if (shortT(oneLine.start)) {
        result = async (log: LogItem, meta: { [key: string]: any }) => {
          const _w = Math.max(
            1,
            Math.floor(
              (((meta[widthMetaKey] as number) || 100) * _toKeep_P) / 100
            )
          );
          log.baseMessage = ellipsisStart(log.baseMessage, _w);
        };
      } else {
        result = async (log: LogItem, meta: { [key: string]: any }) => {
          const _w = Math.max(
            1,
            Math.floor(
              (((meta[widthMetaKey] as number) || 100) * _toKeep_P) / 100
            )
          );
          log.baseMessage = ellipsisEnd(log.baseMessage, _w);
        };
      }
      break;
    default:
      return assertNever(oneLine);
  }
  return result;
}
