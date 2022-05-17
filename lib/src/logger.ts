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
export type ModifierItem = { modifier: modifiers; extra: string | null };

export type aggregators =
  | "first="
  | "every="
  | "sample="
  | "coolsec="
  | "coolmin="
  | "coolhour=";
export type AggregatorItem = { aggregator: aggregators; extra: string | null };

export type filters = "start=" | "end=" | "has=" | "regex=";
export type FilterItem = { filter: filters; extra: string | null };

export type width = "auto" | "chars=";
export type WidthItem = { width: aggregators; extra: string | null };

export class XWLogger {
  tag = "";
  childcount = 0;
  brocount = 0;
  parent = null;
  mytreetags = "";
  buffers: { [key: string]: string[] } = {
    v: [],
    l: [],
    i: [],
    w: [],
    e: [],
  };

  constructor() {}

  init = (extra: { tag?: string } = {}) => {
    if (extra.tag) {
      this.tag = extra.tag;
    } else {
      // generate from parent or random no parent
    }
  };

  confignow = () => {};

  child = (extra: { tag?: string } = {}) => {};
  bro = (extra: { tag?: string } = {}) => {};
  clone = (extra: { tag?: string } = {}) => {};

  job = (extra: {} = {}) => {};
  step = (extra: {} = {}) => {};

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
