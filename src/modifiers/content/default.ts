import { LogMessage } from "../../consts/logs";
import { AnyDict } from "../../utils/ts";
import { ModContentBase } from "./mod_content_base";

export class DefaultContentModifier implements ModContentBase {
  async config(config: AnyDict) {}

  enrich(msg: LogMessage): LogMessage {
    return msg;
  }
}
