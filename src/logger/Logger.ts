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
    const ctx_msg = this._build_msg("Logger scope closed");
    listenGC(this, () => {
      const extra = ctx_getLoggerLogCount();
      ctx_msg.extras = (ctx_msg.extras || []).concat([
        `Log count: ${extra.count}`,
        `Start time: ${extra.start}`,
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

  _build_msg(...msg: any[]): LogMessage {
    // Todo add modifiers here...
    return {
      extras: msg.slice(1),
      level: LogLevel.Info,
      message: msg[0],
      prefixes: [this._config.uuid.split("-")[0]],
      tagID: this._config.uuid,
    };
  }

  l(...msg: any[]) {
    const _msg = this._build_msg(...msg);
    _msg.level = LogLevel.Info;
    this._output?.log(_msg);

    this.__upLogCount();
  }

  l2(...msg: any[]) {
    const extra = eval("ppp1");
    const _msg = this._build_msg(...msg.concat(extra));
    _msg.level = LogLevel.Info;
    this._output?.log(_msg);

    this.__upLogCount();
  }

  mini() {
    return {
      l: this.l.bind(this),
    };
  }
}
