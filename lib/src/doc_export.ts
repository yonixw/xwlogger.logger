// How to use:
// ========================================
//export { XWLogger } from "./logger";
//export { health, health2 } from "./main";
//export const shlomo = 2;

export { IModifier, ModifierFastTime } from "./modifiers/base";

export {
  StackTop_Arg_Auto,
  StackTop_Arg_ByCount,
} from "./modifiers/runtime/stack_top";

export { XWLogger } from "./logger";

// @todo: Use classes to organize, and no "const arrow funcs", better for docs
