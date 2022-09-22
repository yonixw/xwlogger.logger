import { LogMessage } from "../consts/logs";
import { AnyDict } from "../utils/ts";

export interface BaseOutput {
  config(config: AnyDict): Promise<void>;
  log(msg: LogMessage): Promise<void>;
  flush(): Promise<void>;
}
