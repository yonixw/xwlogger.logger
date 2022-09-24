import { LogMessage } from "../../consts/logs";
import { AnyDict } from "../../utils/ts";
import { ModRuntimeBase } from "./mod_runtime_base";

const startPath = process.cwd();
function _get_stack_item(stack: string, i: number) {
  // good for ts-node
  // OR: tsc, if:
  //    need tsconfig "inlineSourceMap" + node flag --enable-source-maps
  const lines = stack.split("\n").filter((e) => /^\s+at/.test(e));
  if (lines.length < i) return "";
  const path = lines[i].replace(/\s+at\s*/, "").replace(startPath, "");
  return path;
}

export class CallStackFuncName implements ModRuntimeBase {
  async config(config: AnyDict) {}

  enrich(_msg: LogMessage, runtimeInfo: AnyDict): LogMessage {
    runtimeInfo = runtimeInfo || { stackIgnore: 2 };

    _msg.extras = (_msg.extras || []).concat([
      _get_stack_item(new Error().stack || "", runtimeInfo.stackIgnore || 2),
    ]);
    return _msg;
  }
}
