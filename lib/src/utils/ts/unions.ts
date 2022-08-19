export function assertNever(stateParentObject: never): never {
  //  parent of state, see
  // https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-exhaustiveness-checking
  throw new Error("Unexpected object: " + stateParentObject);
}
