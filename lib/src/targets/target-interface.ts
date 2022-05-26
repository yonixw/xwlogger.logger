export interface TargetInterface {
  // @todo type literals = LogLevels + ()=>int
  verbose(...args: any[]): number;
  log(...args: any[]): number;
  debug(...args: any[]): number;
  info(...args: any[]): number;
  warn(...args: any[]): number;
  error(...args: any[]): number;
  critical(...args: any[]): number;
}
