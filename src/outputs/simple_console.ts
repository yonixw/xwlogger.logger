import { LogLevel, LogLevelMini, LogMessage } from "../consts/logs";
import { OutputBase } from "./output_base";
import { AnyDict, OptionalDictKeys } from "../utils/ts";
import chalk, { Chalk } from "chalk";

const defaultConfig = {
  useColor: false,
  printJson: false,
};

export const LogLevelColor: { [key in LogLevel]: Chalk } = {
  [LogLevel.Critical]: chalk.red.bold,
  [LogLevel.Error]: chalk.red,
  [LogLevel.Warn]: chalk.yellow,
  [LogLevel.Info]: chalk.white,
  [LogLevel.Verbose]: chalk.bgGreen.black,
  [LogLevel.Debug]: chalk.greenBright,
};

const miniLevelTxt = (lvl: LogLevel, color: boolean = false) => {
  const lvlText = "[" + LogLevelMini[lvl] + "]";
  const _cc_color = LogLevelColor[lvl];
  return color ? _cc_color(lvlText) : lvlText;
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
        const baseline = [miniLevelTxt(msg.level, true)]
          .concat(
            msg.prefixes?.map((e) => chalk.underline.gray(`[${e}]`)) || []
          )
          .concat("\n  - " + msg.message)
          .join(" ");
        const extras =
          msg.extras
            ?.map((e, i) => chalk.grey(`  ${chalk.underline(i + 1)}. ${e}`))
            .join("\n") || "";
        console.log(baseline, extras ? "\n" + extras : "");
      } else {
        const baseline = [miniLevelTxt(msg.level, false)]
          .concat(msg.prefixes?.map((e) => `[${e}]`) || [])
          .concat("\n  - " + msg.message)
          .join(" ");
        const extras =
          msg.extras?.map((e, i) => `\  ${i + 1}. ${e}`).join("\n") || "";
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
