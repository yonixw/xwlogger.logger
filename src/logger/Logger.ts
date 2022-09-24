import { LogLevel, LogMessage } from "../consts/logs";
import { OutputBase } from "../outputs/output_base";
import { getOutput } from "../outputs/output_registery";
import { SimpleConsoleOutput } from "../outputs/simple_console";
import { AnyDict, OptionalDictKeys } from "../utils/ts";
import { randomUUID } from "crypto";
import { listenGC } from "./ShortLogger";
import { ModRuntimeBase } from "../modifiers/runtime/mod_runtime_base";
import { getModRuntime } from "../modifiers/runtime/mod_runtime_registry";
import { ModContentBase } from "../modifiers/content/mod_content_base";
import { getModContent } from "../modifiers/content/mod_content_registry";

const defaultConfig = {
  uuid: "",
  output: "console",
  runtimeModifiers: ["stackline"],
  contentModifiers: ["timeshort"],
};

type LogMeta = {
  count?: number;
  start?: Date;
};

const loggerMeta: { [key: string]: LogMeta } = {
  // External to be available after GC
};

export class Logger {
  _config = defaultConfig;
  _output?: OutputBase;
  _runtimeModifiers: ModRuntimeBase[] = [];
  _contentModifiers: ModContentBase[] = [];

  _set_config(config: AnyDict) {
    this._config = { ...defaultConfig, ...config };
    if (!this._config.uuid) {
      this._config.uuid = randomUUID();
    }
    this._output = getOutput(this._config.output);
    this._config.runtimeModifiers?.forEach((e) => {
      if (!e) return;
      this._runtimeModifiers.push(getModRuntime(e));
    });
    this._config.contentModifiers?.forEach((e) => {
      if (!e) return;
      this._contentModifiers.push(getModContent(e));
    });
  }

  __registerForGCCollect() {
    // The idea is to get all data into consts
    // so node don't need to keep ref to "this" and let GC collect it
    // and in the end, print and END message...
    let ctx_getLoggerLogCount: () => LogMeta = () => ({
      count: -1,
      start: new Date(),
    });
    const ctx_uuid = this._config.uuid;
    if (ctx_uuid) {
      loggerMeta[ctx_uuid] = { count: 0, start: new Date() };
      ctx_getLoggerLogCount = () => {
        const _meta = { ...loggerMeta[ctx_uuid] };
        delete loggerMeta[ctx_uuid];
        return _meta;
      };
    }
    const ctx_output = this._output;
    const ctx_msg = this._build_msg(LogLevel.Info, "Logger scope closed");
    listenGC(this, () => {
      const extra = ctx_getLoggerLogCount();
      ctx_msg.extras = (ctx_msg.extras || []).concat([
        `Log count: ${extra.count}`,
        `Start time: ${extra.start?.toISOString()}`,
      ]);
      ctx_output?.log(ctx_msg);
    });
  }

  __upLogCount() {
    if (loggerMeta[this._config.uuid])
      loggerMeta[this._config.uuid].count =
        (loggerMeta[this._config.uuid].count || 0) + 1;
  }

  constructor(config: OptionalDictKeys<typeof defaultConfig> = defaultConfig) {
    this._set_config(config);
    this.__registerForGCCollect();
  }

  uuid() {
    return this._config.uuid;
  }

  clone() {
    return new Logger(this._config);
  }

  _build_msg(lvl: LogLevel, ...msg: any[]): LogMessage {
    // Todo add modifiers here...
    return {
      extras: msg.slice(1),
      level: lvl,
      message: msg[0],
      prefixes: [this._config.uuid.split("-")[0]],
      tagID: this._config.uuid,
    };
  }

  _log_msg(lvl: LogLevel, stackLevelDelta: number, ...msg: any[]) {
    const runtimeMeta = { stackIgnore: stackLevelDelta + 5 };

    const _msg = this._build_msg(lvl, ...msg);
    this._runtimeModifiers.forEach((r) => r.enrich(_msg, runtimeMeta));
    this._contentModifiers.forEach((r) => r.enrich(_msg));
    this._output?.log(_msg);
    this.__upLogCount();
  }

  _log_tag(lvl: LogLevel, strings: TemplateStringsArray, ...values: any[]) {
    this._log_msg(lvl, 1, String.raw({ raw: strings }, ...values));
  }

  c(...msg: any[]) {
    this._log_msg(LogLevel.Critical, 0, ...msg);
  }
  crit(...msg: any[]) {
    this._log_msg(LogLevel.Critical, 0, ...msg);
  }
  e(...msg: any[]) {
    this._log_msg(LogLevel.Error, 0, ...msg);
  }
  error(...msg: any[]) {
    this._log_msg(LogLevel.Error, 0, ...msg);
  }
  w(...msg: any[]) {
    this._log_msg(LogLevel.Warn, 0, ...msg);
  }
  warn(...msg: any[]) {
    this._log_msg(LogLevel.Warn, 0, ...msg);
  }
  i(...msg: any[]) {
    this._log_msg(LogLevel.Info, 0, ...msg);
  }
  info(...msg: any[]) {
    this._log_msg(LogLevel.Info, 0, ...msg);
  }
  l(...msg: any[]) {
    this._log_msg(LogLevel.Info, 0, ...msg);
  }
  log(...msg: any[]) {
    this._log_msg(LogLevel.Info, 0, ...msg);
  }
  v(...msg: any[]) {
    this._log_msg(LogLevel.Verbose, 0, ...msg);
  }
  verbose(...msg: any[]) {
    this._log_msg(LogLevel.Verbose, 0, ...msg);
  }
  d(...msg: any[]) {
    this._log_msg(LogLevel.Debug, 0, ...msg);
  }
  debug(...msg: any[]) {
    this._log_msg(LogLevel.Debug, 0, ...msg);
  }

  mini() {
    let { c, e, w, i, l, v, d, crit, error, warn, info, log, verbose, debug } =
      this;
    c = c.bind(this);
    e = e.bind(this);
    w = w.bind(this);
    i = i.bind(this);
    l = l.bind(this);
    v = v.bind(this);
    d = d.bind(this);
    crit = crit.bind(this);
    error = error.bind(this);
    warn = warn.bind(this);
    info = info.bind(this);
    log = log.bind(this);
    verbose = verbose.bind(this);
    debug = debug.bind(this);
    return {
      c,
      e,
      w,
      i,
      l,
      v,
      d,
      crit,
      error,
      warn,
      info,
      log,
      verbose,
      debug,
    };
  }

  micro() {
    let { c, e, w, i, l, v, d } = this;
    c = (strings: TemplateStringsArray, ...values: any[]) =>
      this._log_tag(LogLevel.Critical, strings, ...values);
    e = (strings: TemplateStringsArray, ...values: any[]) =>
      this._log_tag(LogLevel.Error, strings, ...values);
    w = (strings: TemplateStringsArray, ...values: any[]) =>
      this._log_tag(LogLevel.Warn, strings, ...values);
    i = (strings: TemplateStringsArray, ...values: any[]) =>
      this._log_tag(LogLevel.Info, strings, ...values);
    l = (strings: TemplateStringsArray, ...values: any[]) =>
      this._log_tag(LogLevel.Info, strings, ...values);
    v = (strings: TemplateStringsArray, ...values: any[]) =>
      this._log_tag(LogLevel.Verbose, strings, ...values);
    d = (strings: TemplateStringsArray, ...values: any[]) =>
      this._log_tag(LogLevel.Debug, strings, ...values);
    return { c, e, w, i, l, v, d };
  }
}
