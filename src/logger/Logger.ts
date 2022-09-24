import { LogLevel, LogMessage } from "../consts/logs";
import { OutputBase } from "../outputs/output_base";
import { getOutput } from "../outputs/output_registery";
import { SimpleConsoleOutput } from "../outputs/simple_console";
import { AnyDict, OptionalDictKeys } from "../utils/ts";
import { randomUUID } from "crypto";
import { listenGC } from "./ShortLogger";

const defaultConfig = {
  uuid: "",
  output: "console",
};

type LogMeta = {
  count?: number;
  start?: Date;
};

const loggerMeta: { [key: string]: LogMeta } = {
  // External to be available after GC
};

const startPath = process.cwd();
function _get_stack_item(stack: string, i: number) {
  // good for ts-node
  // OR: tsc, if:
  //    need tsconfig "inlineSourceMap" + node flag --enable-source-maps
  const lines = stack.split("\n").filter((e) => /^\s+at/.test(e));
  if (lines.length < i) return "";
  const path = lines[i].replace(/\s+at/, "").replace(startPath, "");
  return path;
}

export class Logger {
  _config = defaultConfig;
  _output?: OutputBase;

  _set_config(config: AnyDict) {
    this._config = { ...defaultConfig, ...config };
    if (!this._config.uuid) {
      this._config.uuid = randomUUID();
    }
    this._output = getOutput(this._config.output);
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

  _log_msg(lvl: LogLevel, ...msg: any[]) {
    const _msg = this._build_msg(lvl, ...msg);
    _msg.extras = (_msg.extras || []).concat([
      _get_stack_item(new Error().stack || "", 2),
    ]);
    this._output?.log(_msg);
    this.__upLogCount();
  }

  c(...msg: any[]) {
    this._log_msg(LogLevel.Critical, ...msg);
  }
  e(...msg: any[]) {
    this._log_msg(LogLevel.Error, ...msg);
  }
  w(...msg: any[]) {
    this._log_msg(LogLevel.Warn, ...msg);
  }
  i(...msg: any[]) {
    this._log_msg(LogLevel.Info, ...msg);
  }
  l(...msg: any[]) {
    this._log_msg(LogLevel.Info, ...msg);
  }
  v(...msg: any[]) {
    this._log_msg(LogLevel.Verbose, ...msg);
  }
  d(...msg: any[]) {
    this._log_msg(LogLevel.Debug, ...msg);
  }

  mini() {
    let { c, e, w, i, l, v, d } = this;
    c = c.bind(this);
    e = e.bind(this);
    w = w.bind(this);
    i = i.bind(this);
    l = l.bind(this);
    v = v.bind(this);
    d = d.bind(this);
    return { c, e, w, i, l, v, d };
  }
}
