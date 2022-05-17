import { padNum } from "./logger.utils";

describe("Logger utils", () => {
  test("pad", () => {
    expect(padNum("123", 5)).toBe("00123");
  });
});
