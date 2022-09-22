export enum LogLevel {
  Security = 0,
  Critical = 1,
  Error = 2,
  Warn = 3,
  Info = 4,
  Verbose = 5,
  Debug = 6,
}

export const LogLevelDesc: { [key in LogLevel]: string } = {
  [LogLevel.Security]: "Security",
  [LogLevel.Critical]: "Critical",
  [LogLevel.Error]: "Error",
  [LogLevel.Warn]: "Warn",
  [LogLevel.Info]: "Info",
  [LogLevel.Verbose]: "Verbose",
  [LogLevel.Debug]: "Debug",
};

export const LogLevelMini: { [key in LogLevel]: string } = {
  [LogLevel.Security]: "SECR",
  [LogLevel.Critical]: "CRIT",
  [LogLevel.Error]: "ERR",
  [LogLevel.Warn]: "WRN",
  [LogLevel.Info]: "INF",
  [LogLevel.Verbose]: "VRB",
  [LogLevel.Debug]: "DBG",
};

export interface LogMessage {
  tagID: string;
  level: LogLevel;
  message: string;
  prefixes: string[] | null;
  extras: string[] | null;
}
