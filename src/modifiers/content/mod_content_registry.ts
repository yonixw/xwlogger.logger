import { DefaultContentModifier } from "./default";
import { ModContentBase } from "./mod_content_base";
import { Timestamp } from "./Timestamp";

type ModContentInitFunc = () => ModContentBase;

const _all_mod_Content: { [key: string]: ModContentInitFunc } = {};

function addModContent(key: string, init: ModContentInitFunc) {
  if (_all_mod_Content[key]) throw "Already registered! Security!";

  _all_mod_Content[key] = init;
}

const defaultKey = "default";
export function getModContent(key: string) {
  if (!_all_mod_Content[key]) {
    console.log(`Can't find '${key}', falling to default...`);
    return _all_mod_Content[defaultKey]();
  }

  return _all_mod_Content[key]();
}

addModContent(defaultKey, () => new DefaultContentModifier());
addModContent("timeshort", () => {
  const t = new Timestamp();
  t.config({ short: true });
  return t;
});
