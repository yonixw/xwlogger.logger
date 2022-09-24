import { LogMessage } from "../../consts/logs";
import { AnyDict } from "../../utils/ts";

export interface ModContentBase {
  config(config: AnyDict): Promise<void>;
  enrich(msg: LogMessage): LogMessage;
}
