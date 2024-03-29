import { OutputBase } from "./output_base";
import { SimpleConsoleOutput } from "./simple_console";

type outputInitFunc = () => OutputBase;

const _all_outputs: { [key: string]: outputInitFunc } = {};

export function addOutput(key: string, init: outputInitFunc) {
  if (_all_outputs[key]) throw "Already registered! Security!";

  _all_outputs[key] = init;
}

const defaultKey = "default";

export function getOutput(key: string) {
  if (!_all_outputs[key]) {
    console.log(`Can't find '${key}', falling to default...`);
    return _all_outputs[defaultKey]();
  }

  return _all_outputs[key]();
}

addOutput(defaultKey, () => new SimpleConsoleOutput());
addOutput("console", () => new SimpleConsoleOutput());
