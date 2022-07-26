import {
  ellipsisEnd,
  ellipsisMid,
  ellipsisStart,
  fastdate,
  fasttime,
  fullISODate,
} from "./base";

describe("Meta base utils", () => {
  // Array of 10 random short sentences
  const sentences = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    "Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit",
    "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet",
    "Ut enim ad minima veniam, quis nostrum exercitationem ullam",
    "Quis autem vel eum iure reprehenderit qui in ea voluptate velit",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui",
    "Et harum quidem rerum facilis est et expedita distinctio. Nam",
    "10 less than 10".substring(0, 10 - 6 - 1),
  ];

  test("elapsis end", () => {
    // test each sentence not empty
    for (const sentence of sentences) {
      expect(ellipsisEnd(sentence, 10).length).toBe(
        Math.min(10, sentence.length + 3)
      );
      expect(ellipsisEnd(sentence, 10).endsWith("...")).toBe(true);
    }
  });

  test("elapsis start", () => {
    // test each sentence not empty
    for (const sentence of sentences) {
      expect(ellipsisStart(sentence, 10).length).toBe(
        Math.min(10, sentence.length + 3)
      );
      expect(ellipsisStart(sentence, 10).startsWith("...")).toBe(true);
    }
  });

  test("elapsis mid", () => {
    // test each sentence not empty
    for (const sentence of sentences) {
      expect(ellipsisMid(sentence, 10).length).toBe(
        Math.min(10, sentence.length + 6)
      );
      expect(ellipsisMid(sentence, 10).startsWith("...")).toBe(true);
      expect(ellipsisMid(sentence, 10).endsWith("...")).toBe(true);
    }
  });

  test("fast time", () => {
    // list of random dates and times
    const dates = [
      new Date(2020, 0, 1, 0, 5, 0, 0),
      new Date(2001, 6, 10, 15, 10, 0, 2),
      new Date(1991, 8, 15, 7, 30, 0, 3),
      new Date(1970, 9, 29, 2, 59, 0, 4),
    ];

    const expected = [
      "2020-01-01T00:05:00+",
      "2001-07-10T15:10:00+",
      "1991-09-15T07:30:00+",
      "1970-10-29T02:59:00+",
      "1990-05-02T23:06:00+",
    ];

    for (let i = 0; i < dates.length; i++) {
      const result = fullISODate({ d: dates[i], utc: false });
      expect(result.startsWith(expected[i])).toBe(true);
    }
  });

  test("fast time utc", () => {
    // list of random dates and times

    // UTC ends with Z
    const datesUTC = [new Date("1990-05-03T05:06:00.000Z")];
    const expectedUTC = ["1990-05-03T05:06:00+00:00"];

    for (let i = 0; i < datesUTC.length; i++) {
      const result = fullISODate({ d: datesUTC[i], utc: false });
      const resultUTC = fullISODate({ d: datesUTC[i], utc: true });

      if (new Date().getTimezoneOffset() === 0) {
        expect(result).toBe(resultUTC);
      } else {
        expect(result.startsWith(expectedUTC[i])).toBe(false);
        expect(resultUTC.startsWith(expectedUTC[i])).toBe(true);
      }
    }
  });
});
