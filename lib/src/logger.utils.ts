export function padNum(str: string, count: number): string {
  // https://stackoverflow.com/a/29216917/1997873
  let padstr =
    count == 4
      ? "0000"
      : count == 10
      ? "0000000000"
      : new Array(count).fill(0).join("");
  return padstr.slice(str.toString().length) + str;
}

export function randomHex(seed: number | undefined): string {
  if (!seed) seed = Math.random();
  return padNum(Math.ceil(10000 + seed * 90000).toString(16), 5);
}

/**
 * **Create a random tag**
 * @param {Date | null} basedate Date for the tag, now if null
 * @param {number} seed Set seed. random if null
 * @returns {string} the tag
 */
export function randomTag(
  basedate: Date | null = new Date(),
  seed: number = Math.random()
): string {
  if (basedate) {
    try {
      const parts =
        /([0-9]{2,4})\-([0-9]{0,2})\-([0-9]{0,2})T([0-9]{0,2}):([0-9]{0,2}):([0-9]{0,2})\.([0-9]{1,3})Z/.exec(
          basedate.toISOString()
        );
      if (parts) {
        let tag = `t--d${parts[3]}${parts[2]}${parts[1].substring(
          parts[1].length - 2
        )}.${parts[4]}${parts[5]}.${parts[6]}r${randomHex(seed)}.a`;
        return tag;
      }
    } catch (error) {}
  }

  // Error or empy basedate
  return `t--r${randomHex(seed)}.a`;
}
