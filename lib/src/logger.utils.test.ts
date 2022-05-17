import { padNum, randomHex, randomTag } from "./logger.utils";

describe("Logger utils", () => {
  test("pad", () => {
    expect(padNum("1", 5)).toBe("00001");
    expect(padNum("123", 5)).toBe("00123");
    expect(padNum("123456", 5)).toBe("123456");

    expect(padNum("1", 4)).toBe("0001");
    expect(padNum("123", 4)).toBe("0123");
    expect(padNum("123456", 4)).toBe("123456");

    expect(padNum("1", 10)).toBe("0000000001");
    expect(padNum("123", 10)).toBe("0000000123");
    expect(padNum("12345678910", 10)).toBe("12345678910");
  });

  test("randhex", () => {
    expect(randomHex(0.5)).toBe("0d6d8");
    expect(randomHex(0.99)).toBe("1831c");
  });

  test("randtag-empty", () => {
    expect(randomTag(null, 0.5)).toBe("t--r0d6d8.a");
    expect(randomTag(null, 0.99)).toBe("t--r1831c.a");
  });

  test("randtag-date", () => {
    const d = new Date(2022, 5 - 1, 17, 4, 29, 0, 0);
    expect(randomTag(d, 0.5)).toBe("t--d170522.0429.00r0d6d8.a");
    expect(randomTag(d, 0.99)).toBe("t--d170522.0429.00r1831c.a");
  });
});
