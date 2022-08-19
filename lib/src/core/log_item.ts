export enum LogLevels {
  VERBOSE = 0,
  LOG,
  DEBUG,
  INFO,
  SUCESS,
  FAIL,
  WARN,
  ERROR,
  CRITICAL,
}

export enum LogConsoleMode {
  MIN = 0,
  MAX,
}

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
export class LogItem {
  level: LogLevels = 0;
  prefixs: string[] = [];
  suffixs: string[] = [];
  baseMessage: string = "";
  metadata: { [key: string]: any } = {};
}

export type ProcessLogF = (log: LogItem) => Promise<void>;

export interface BaseProcessLog {
  processLog: ProcessLogF;
}
