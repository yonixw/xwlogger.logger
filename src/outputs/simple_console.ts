import { LogLevelMini, LogMessage } from "../consts/logs";
import { OutputBase } from "./output_base";
import { AnyDict, OptionalDictKeys } from "../utils/ts";
import chalk from "chalk";

const defaultConfig = {
  useColor: false,
  printJson: false,
};

export class SimpleConsoleOutput implements OutputBase {
  _config = defaultConfig;

  _set_config(config: AnyDict) {
    this._config = { ...defaultConfig, ...config };
  }

  constructor(config: OptionalDictKeys<typeof defaultConfig> = defaultConfig) {
    this._set_config(config);
  }

  _log(msg: LogMessage) {
    if (this._config.printJson) {
      console.log(JSON.stringify(msg));
    } else {
      if (this._config.useColor) {
        const baseline = (msg.prefixes?.map((e) => `[${e}]`) || [])
          .concat([`[${LogLevelMini[msg.level]}]`])
          .concat([chalk.yellow(msg.message)])
          .join(" ");
        const extras =
          msg.extras
            ?.map((e, i) => `\  ${chalk.underline(i)}. ${e}`)
            .join("\n") || "";
        console.log(baseline, extras ? "\n" + extras : "");
      } else {
        const baseline = (msg.prefixes?.map((e) => `[${e}]`) || [])
          .concat([`[${LogLevelMini[msg.level]}]`])
          .concat([msg.message])
          .join(" ");
        const extras =
          msg.extras?.map((e, i) => `\  ${i}. ${e}`).join("\n") || "";
        console.log(baseline, extras ? "\n" + extras : "");
      }
    }
  }

  config(config: AnyDict): Promise<void> {
    return new Promise((ok, _) => {
      this._set_config(config);
      ok();
    });
  }

  log(msg: LogMessage): Promise<void> {
    return new Promise((ok, _) => {
      this._log(msg);
      ok();
    });
  }

  flush(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
