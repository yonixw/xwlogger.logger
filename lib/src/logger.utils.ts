export function padNum(str: string, count: number): string {
  let padstr =
    count == 4
      ? "0000"
      : count == 10
      ? "0000000000"
      : new Array(count).fill(0).join("");
  return String(padstr + str).slice(-1 * count);
}

export function randomHex(seed = Math.random()): string {
  return padNum(Math.ceil(10000 + seed * 90000).toString(16), 5);
}

export function randomTag(basedate: Date | null = new Date()): string {
  if (basedate) {
    try {
      const parts =
        /([0-9]{2,4})\-([0-9]{0,2})\-([0-9]{0,2})T([0-9]{0,2}):([0-9]{0,2}):([0-9]{0,2})\.([0-9]{1,3})Z/.exec(
          basedate.toISOString()
        );
      if (parts) {
        let tag = `t--d${parts[3]}${parts[2]}${parts[1].substring(
          parts[1].length - 2
        )}.${parts[4]}${parts[5]}.${parts[6]}.${randomHex()}.a`;
        return tag;
      }
    } catch (error) {}
  }

  // Error or empy basedate
  return `t--r${randomHex()}.a`;
}
