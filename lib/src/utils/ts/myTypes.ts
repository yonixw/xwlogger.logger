import { z } from "zod";

export type ShortBool = 0 | 1 | true | false;

export const ShortBool_scheme = z.literal(0).or(z.literal(1)).or(z.boolean());

export function shortT(b: ShortBool | undefined) {
  if (b === undefined || b === null) return false;
  return b === 1 || b === true;
}
