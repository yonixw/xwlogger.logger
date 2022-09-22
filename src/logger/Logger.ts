import { LogLevel, LogMessage } from "../consts/logs";
import { BaseOutput } from "../outputs/base_output";
import { getOutput } from "../outputs/output_registery";
import { SimpleConsoleOutput } from "../outputs/simple_console";
import { AnyDict, OptionalDictKeys } from "../utils/ts";
import { randomUUID } from "crypto";

const defaultConfig = {
  tagID: randomUUID(),
  output: "console",
};

export class Logger {
  _config = defaultConfig;
  _output?: BaseOutput;

  _set_config(config: AnyDict) {
    this._config = { ...defaultConfig, ...config };
    this._output = getOutput(this._config.output);
  }

  constructor(config: OptionalDictKeys<typeof defaultConfig> = defaultConfig) {
    this._set_config(config);
  }

  l(msg: string) {
    const msgInfo: LogMessage = {
      extras: [],
      level: LogLevel.Info,
      message: msg,
      prefixes: [this._config.tagID.split("-")[0]],
      tagID: this._config.tagID,
    };
    this._output?.log(msgInfo);
  }
}
