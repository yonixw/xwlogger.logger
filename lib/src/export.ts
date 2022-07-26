// How to use:
// ========================================
//export { XWLogger } from "./logger";
//export { health, health2 } from "./main";
//export const shlomo = 2;

export {
  ellipsisEnd,
  ellipsisMid,
  ellipsisStart,
  fastdate,
  fasttime,
  fullISODate,
  lineNumber,
  replaceSecrets,
  stacktrace,
} from "./modifiers/base";

export { metamodifiers as METAMETA } from "./modifiers/base";

export { XWLogger } from "./logger";

// @todo: Use classes to organize, and no "const arrow funcs", better for docs
