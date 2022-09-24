import { LogMessage } from "../../consts/logs";
import { AnyDict, OptionalDictKeys } from "../../utils/ts";
import { ModContentBase } from "./mod_content_base";

const defaultConfig = {
  short: true,
};

export class Timestamp implements ModContentBase {
  _config?: OptionalDictKeys<typeof defaultConfig>;

  async config(config: OptionalDictKeys<typeof defaultConfig> = defaultConfig) {
    this._config = { ...defaultConfig, ...config };
  }

  enrich(_msg: LogMessage): LogMessage {
    const _d = new Date().toISOString();

    if (this._config?.short) {
      //['2022','09','24','23','43','01','879','']
      const d = _d.split(/[T\+Z\.\-\:]/);
      _msg.prefixes?.push(`${d[2]}/${d[1]} ${d[3]}:${d[4]}:${d[5]}`);
    } else {
      _msg.prefixes?.push(_d);
    }
    return _msg;
  }
}
