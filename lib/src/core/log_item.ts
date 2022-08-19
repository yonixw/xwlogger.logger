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

export class LogItem {
  level: LogLevels = 0;
  prefixs: string[] = [];
  suffixs: string[] = [];
  baseMessage: string = "";
  metadata: { [key: string]: any } = {};
}
