import { LogMessage } from "../../consts/logs";
import { AnyDict } from "../../utils/ts";

export interface ModRuntimeBase {
  config(config: AnyDict): Promise<void>;
  enrich(msg: LogMessage, runtimeMeta?: AnyDict): LogMessage;
}
