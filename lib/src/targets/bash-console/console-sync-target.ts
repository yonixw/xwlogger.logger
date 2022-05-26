import { TargetInterface } from "../target-interface";

export class ConsoleSyncTarget implements TargetInterface {
  verbose(...args: any[]): number {
    console.log(args);
    return 0;
  }
  log(...args: any[]): number {
    console.log(args);
    return 0;
  }
  debug(...args: any[]): number {
    console.debug(args);
    return 0;
  }
  info(...args: any[]): number {
    console.info(args);
    return 0;
  }
  warn(...args: any[]): number {
    console.warn(args);
    return 0;
  }
  error(...args: any[]): number {
    console.error(args);
    return 0;
  }
  critical(...args: any[]): number {
    console.error(args);
    return 0;
  }
}
