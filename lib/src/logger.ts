import { randomTag } from "./logger.utils";

export enum LogLevels {
  VERBOSE = 0,
  LOG,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  CRITICAL,
}

export enum ConfigSources {
  ENV = 0,
  CLI,
  TEMP_FILE,
  HTTPS_EP,
}

export const SCOPE_DIVIDER = process.env.XWLOGGER_SCOPE_DIVIDER || ";;;";
export const SECTION_DIVIDER = process.env.XWLOGGER_SECTION_DIVIDER || ";";

export type Scopes =
  | "all"
  | "level=="
  | "level.ge=="
  | "level.le=="
  | "depth=="
  | "depth.ge=="
  | "depth.le=="
  | "child=="
  | "bro=="
  | "job=="
  | "step==";
export type ScopeItem = { scope: Scopes; extra: string | null };

export type operations =
  | "sync.log"   // can be disabled for security reasons
  | "reconfig.sec==" // minimum for security
  | "reconfig.min=="
  | "reconfig.hour=="
  | "conf.http==" // env, tmp and cli are known places
  | "conf.http.head=="
  | "conf.http.urlp=="
  | "locale==" // default "en"
  | "all.env.secret" // from big len to small len // can be enforced for security
  | "print.all"
  | "print.errors"
  | "print.top==" // print under tag "xwmete.*"
  | "print.bottom==";
export type OperationItem = { operation: operations; extra: string | null };

// Publish variants (like npm console only for debug, full for prod... or plugin bases..)
export type targets =
  | "console"
  | "local.server==" // 0.0.0.0 or 127.0.0.1 or :<port> or alltogether... 
      // will have local printed secret (never open)
      // local api can enforce always "127.0.0.1" for security
  | "file==" // max mb for security reasons...
  | "rotate.mb=="
  | "rotate.gb=="
  | "rotate.min=="
  | "rotate.days=="
  | "rotate.months=="
  | "remote.http==" // (whitelist of all possible EP api from code for security)
  | "header=="
  | "url.param==";
export type TargetsItem = { operation: operations; extra: string | null };

export type metamodifiers =
  | "full.time"
  | "hm.time"
  | "dmy.time"
  | "delta"
  | "parent.delta"
  | "line.num"
  | "no.color"
  | "mask.every=="
  | "mask.bound=="
  | "onelines.tart"
  | "oneline.end"
  | "oneline.mid"
  | "name.args" // not in arrow
  | "stack.top=="
  | "max.cols==";
export type MetaModifierItem = {
  modifier: metamodifiers;
  extra: string | null;
};

export type query =
  | "first=="
  | "every=="
  | "sample==" // float like rand()=(0.00,1.00)
  | "cool.sec=="
  | "cool.min=="
  | "cool.hour=="
  | "start=="
  | "end=="
  | "has=="
  | "simpleregex==" // maybe simple only to avoid accidental DDOS?
  | "bins=="; // for log g (group)
export type QueryItem = { query: query; extra: string | null };

export class XWLogger<T extends { [K in keyof T]: string }> {
  tag = "";
  childcount = 0;
  brocount = 0;
  parent = null;
  mytreetags = "";
  buffers: { [key: string]: string[] } = {
    v: [],
    l: [],
    d: [],
    i: [],
    w: [],
    e: [],
    c: [],
  };

  constructor() {}

  // todo: string lib hard type

  init = (
    extra: {
      tag?: string;
      parent?: XWLogger<T>;
      parenttag?: string;
      brotag?: string;
    } = {}
  ) => {
    if (extra.tag) {
      this.tag = extra.tag;
    } else {
      if (!extra.parent && !extra.parenttag && !extra.brotag) {
        this.tag = randomTag();
      } else {
        // TODO: next sibling from parent...
        // if from sting .. add 'a?' instead of 'a'
      }
    }
  };

  confignow = () => {};

  child = (extra: { tag?: string } = {}) => {};
  bro = (extra: { tag?: string } = {}) => {};
  clone = (extra: { tag?: string } = {}) => {};

  job = (extra: {} = {}) => {};
  step = (extra: {} = {}) => {};

  myTag = () => this.tag;

  root = (): XWLogger<T> => {
    return this;
  };

  addSecret = (s: string) => {};

  verbose = (...args: any[]): number => {
    return -1;
  };

  logf = (...args: any[]): number => {
    return -1;
  };

  logk = <K extends keyof T>(key: K, ...args: any[]): number => {
    return -1;
  };

  log18 = <K extends keyof T>(
    key: K,
    params: { [key: string]: string },
    ...args: any[]
  ): number => {
    //i18n text and {{params}}
    return -1;
  };

  log = (...args: any[]): number => {
    return -1;
  };

  debug = (...args: any[]): number => {
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

  critical = (...args: any[]): number => {
    return -1;
  };

  v = (...args: any[]): number => {
    return this.l(...args);
  };

  l = (...args: any[]): number => {
    return this.l(...args);
  };

  d = (...args: any[]): number => {
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

  c = (...args: any[]): number => {
    return this.l(...args);
  };

  vf = (...args: any[]): number => {
    return this.l(...args);
  };

  lf = (...args: any[]): number => {
    return this.l(...args);
  };

  df = (...args: any[]): number => {
    return this.l(...args);
  };

  ifmt = (...args: any[]): number => {
    return this.l(...args);
  };

  wf = (...args: any[]): number => {
    return this.l(...args);
  };

  ef = (...args: any[]): number => {
    return this.l(...args);
  };

  cf = (...args: any[]): number => {
    return this.l(...args);
  };
}
