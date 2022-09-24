import { LogMessage } from "../../consts/logs";
import { AnyDict } from "../../utils/ts";
import { ModRuntimeBase } from "./mod_runtime_base";

export class DefaultRuntimeModifier implements ModRuntimeBase {
  async config(config: AnyDict) {}

  enrich(msg: LogMessage): LogMessage {
    return msg;
  }
}
