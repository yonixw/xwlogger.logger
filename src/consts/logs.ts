export enum LogLevel {
  Critical = 0, // Can not function at all (some assumption not true)
  Error = 1,
  Warn = 2, // Can cause error, watch out
  Info = 3,
  Verbose = 4, // For users
  Debug = 5, // For developers
}

export const LogLevelDesc: { [key in LogLevel]: string } = {
  [LogLevel.Critical]: "Critical",
  [LogLevel.Error]: "Error",
  [LogLevel.Warn]: "Warn",
  [LogLevel.Info]: "Info",
  [LogLevel.Verbose]: "Verbose",
  [LogLevel.Debug]: "Debug",
};

export const LogLevelMini: { [key in LogLevel]: string } = {
  [LogLevel.Critical]: "CRIT",
  [LogLevel.Error]: "EROR",
  [LogLevel.Warn]: "WARN",
  [LogLevel.Info]: "INFO",
  [LogLevel.Verbose]: "VRBS",
  [LogLevel.Debug]: "DEBG",
};

export interface LogMessage {
  tagID: string;
  level: LogLevel;
  message: string;
  prefixes: string[] | null;
  extras: string[] | null;
}
