// How to use:
// ========================================
//export { XWLogger } from "./logger";
//export { health, health2 } from "./main";
//export const shlomo = 2;

export {
  IModifier,
  ModifierFastTime,
  ModifiersDirectives,
  StackTop_Auto,
  StackTop_ByCount,
  StackTop_AutoZod,
  StackTop_ByCountZod,
  ModifiersDirectivesZod,
} from "./modifiers/base";

export { XWLogger } from "./logger";

// @todo: Use classes to organize, and no "const arrow funcs", better for docs
