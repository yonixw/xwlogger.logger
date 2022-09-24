import { CallStackFuncName } from "./CallStackFuncName";
import { DefaultRuntimeModifier } from "./default";
import { ModRuntimeBase } from "./mod_runtime_base";

type ModRuntimeInitFunc = () => ModRuntimeBase;

const _all_mod_runtime: { [key: string]: ModRuntimeInitFunc } = {};

function addModRuntime(key: string, init: ModRuntimeInitFunc) {
  if (_all_mod_runtime[key]) throw "Already registered! Security!";

  _all_mod_runtime[key] = init;
}

const defaultKey = "default";
export function getModRuntime(key: string) {
  if (!_all_mod_runtime[key]) {
    console.log(`Can't find '${key}', falling to default...`);
    return _all_mod_runtime[defaultKey]();
  }

  return _all_mod_runtime[key]();
}

addModRuntime(defaultKey, () => new DefaultRuntimeModifier());
addModRuntime("stackline", () => new CallStackFuncName());
