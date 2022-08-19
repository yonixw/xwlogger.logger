import { randomTag } from "./logger.utils";

export enum ConfigSources {
  // Least to most dynamic
  CLI = 0,
  JS_READONLY, // Web Prod
  LOCAL_COOKIE, // Good for web local dev
  ENV, // Good for Lambdas, not K8s
  TEMP_FILE, // Good for SSH, K8s debug
  HTTPS_JSON, // Good for no session control
}

export const SCOPE_DIVIDER = "------6"; // Need to be url safe
export const SECTION_DIVIDER = "---3";

export type Plugins = "all" | "websend" | "elastic" | "colors" | "localwebview";

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

export type Security =
  | "maxstring=="
  | "domains.wl==" // domainA;domainB;... for both targets and configs and good for any target checker
  | "targets.wl==" // @todo exception and exit if 2 custom targets with same name! someone try hijacking!
  | "no.sync"
  | "force.sync" // Good For lambda
  | "env.mask==" // 0...N, max chars to show. 0 = all mask
  | "local.server.bind==" // none, 127.0.0.1 , 0.0.0.0 + PORT - list;
  | "file.max.mb=="
  | "file.max.count=="
  | "tag.max.items=="
  | "max.prints.second=="; // anti-ddos?;

export type operations =
  | "sync.log" // can be disabled for security reasons // must for lambdas (no worker)
  | "flush.time==" // interval for force sending logs (ignored by console)
  | "priority==" // 0 1 2, imply not in sequence, to others
  | "nosequence" // imply not in sequence, even same tag
  | "reconfig.sec==" // minimum for security
  | "reconfig.min=="
  | "reconfig.hour=="
  | "conf.http==" // env, tmp and cli are known places
  | "conf.http.head=="
  | "conf.http.urlp=="
  | "locale==" // default "en"
  | "all.env.secret" // from big len to small len // can be enforced for security
  | "expire.from==" // minute... for less use random users
  | "expire.min==" // expire and return to default.. good to limit log collection
  | "expire.hours=="
  | "expire.days=="
  | "print.all"
  | "print.errors"
  | "print.top==" // print under tag "xwmeta.*"
  | "print.bottom==";
export type OperationItem = { operation: operations; extra: string | null };

// Publish variants (like npm console only for debug, full for prod... or plugin bases..)
export type targets =
  | "bash.console"
  | "chrome.console"
  | "local.server==" // 0.0.0.0 or 127.0.0.1 or :<port> or alltogether...
  // will have local printed secret (never open)
  // local api can enforce always "127.0.0.1" for security
  | "file==" // max mb for security reasons...
  | "rotate.mb=="
  | "rotate.gb=="
  | "rotate.min=="
  | "rotate.days=="
  | "rotate.months=="
  | "rotate.file.count=="
  | "custom==" // custom plugin key in my global dict
  | "remote.http==" // (whitelist of all possible EP api from code for security)
  | "header=="
  | "url.param==";
export type TargetsItem = { operation: operations; extra: string | null };

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
  buffers: { [key: string]: { priority?: number; logitem: string }[] } = {
    seq: [], // filter not call anything, not just not sending to target
    priority0: [],
    priority1: [],
    priority2: [],
  };
  geti18Dict: (lang: string) => Promise<T | null> | null = () => null;
  i18Dict: T | null = null;
  i18Lang: string = "en";

  constructor() {}

  // todo: string lib hard type

  init = (
    extra: {
      tag?: string;
      parent?: XWLogger<T>;
      parenttag?: string;
      brotag?: string;
      geti18Dict?: (lang: string) => Promise<T | null> | null;
      i18Dict?: T;
    } = {}
  ) => {
    if (extra.geti18Dict) {
      if (extra.i18Dict) {
        this.i18Dict = extra.i18Dict;
        this.geti18Dict = extra.geti18Dict;
      } else {
        this.geti18Dict = extra.geti18Dict;
      }
    }
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

    return this;
  };

  confignow = async () => {
    if (this.geti18Dict) this.i18Dict = await this.geti18Dict(this.i18Lang);
  };

  // @todo - don't create time to flush if no logs - for lambda
  flushnow = () => {};

  getDomainsWL = () => ["domain"]; // @todo, how custom plguin can get WL domains?

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

  // todo add secret hash? with regex for performance finding?

  // todo type literal: type = ${LogLevels=log/l/..error/e} + ${f/k/18/""}

  logf = (...args: any[]): number => {
    // Same as String.Format if any...
    return -1;
  };

  logk = <K extends keyof T>(key: K, ...args: any[]): number => {
    // i18 but no params
    return -1;
  };

  log18 = <K extends keyof T>(
    key: K,
    i18params: { [key: string]: any },
    ...args: any[]
  ): number => {
    //i18n text and {{params}}
    return -1;
  };

  log = (...args: any[]): number => {
    return -1;
  };
}
