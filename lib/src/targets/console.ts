/**
 * The message will look like:
 *
 * Mode Full:
 * ```
 * LEVEL FFFF - tag - [prefix1] .. [prefixN] - message \n
 *  - suffix
 *  - suffix 2
 * ```
 *
 * Mode minimal:
 * ```
 * LEVEL FFFF - tag - [prefix1]x2 message
 * ```
 */

export enum LogConsoleMode {
  MIN = 0,
  MAX,
}

export enum KnownConsoleProperties_Enum {
  VISIBLE_WIDTH = 0,
}

export const KnownConsoleProperties: {
  [key in KnownConsoleProperties_Enum]: string;
} = {
  [KnownConsoleProperties_Enum.VISIBLE_WIDTH]: "visibile_width",
};
