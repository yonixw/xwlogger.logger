export enum LogLevels {
  VERBOSE = 0,
  LOG,
  INFO,
  WARN,
  ERROR,
}

export type modifiers =
  | "timestamp"
  | "delta"
  | "parentdelta"
  | "linenum"
  | "nocolor"
  | "maskevery="
  | "maskbound="
  | "onelinestart"
  | "onelineend"
  | "onelinemid"
  | "name-args" // not in arrow
  | "stacktop=";

export type aggregators = "first=" | "every=" | "coolsec=";

export type filters = "start=" | "end=" | "has=" | "regex=";

export type width = "auto" | "chars=";

export class XWLogger {
  tag = "";
  childcount = 0;
  brocount = 0;
  parent = null;
  mytreetags = "";

  constructor() {}

  init = (tag: string) => {
    // if empty - radnom
  };

  confignow = () => {};

  child = (tokenOnly: boolean = false) => {};
  bro = (tokenOnly: boolean = false) => {};
  clone = (tokenOnly: boolean = false) => {};

  job = (tokenOnly: boolean = false) => {};
  step = (tokenOnly: boolean = false) => {};

  verbose = (...args: any[]): number => {
    return -1;
  };

  log = (...args: any[]): number => {
    return -1;
  };

  info = (...args: any[]): number => {
    return -1;
  };

  warn = (...args: any[]): number => {
    return -1;
  };

  error = (...args: any[]): number => {
    return -1;
  };

  v = (...args: any[]): number => {
    return this.l(...args);
  };

  l = (...args: any[]): number => {
    return this.l(...args);
  };

  i = (...args: any[]): number => {
    return this.l(...args);
  };

  w = (...args: any[]): number => {
    return this.l(...args);
  };

  e = (...args: any[]): number => {
    return this.l(...args);
  };
}
