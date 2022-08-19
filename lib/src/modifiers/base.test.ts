import { fastdate, fullISODate, lineNumber, replaceSecrets } from "./base";

describe("Meta base utils", () => {
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

  /*   test("fast time compose", () => {
    const d = new Date();
    const dt = d.getTime();
    expect(fastdate(d) + "T" + ModifierFastTime.fasttime(d)).toBe(
      fullISODate({ d, utc: false })
    );
    expect(fastdate(dt) + "T" + ModifierFastTime.fasttime(dt)).toBe(
      fullISODate({ d, utc: false })
    );
  }); */

  test("replace env", () => {
    const input = "sec1 secret2 sEcReT3 00001111secretsecretsecret";

    expect(replaceSecrets(input, ["sec"], "*").indexOf("sEcReT")).toBe(-1);
    expect(replaceSecrets(input, ["sec"], "*").indexOf("*1")).toBeGreaterThan(
      -1
    );
    expect(
      replaceSecrets(input, ["sec"], "*").indexOf("*ret2")
    ).toBeGreaterThan(-1);

    // Replace big before small
    expect(replaceSecrets(input, ["sec", "secret"], "*").indexOf("*ret2")).toBe(
      -1
    );
    expect(replaceSecrets(input, ["sec", "secret"], "*").indexOf("*ReT3")).toBe(
      -1
    );

    // replace with regex, with priority, before any text even if bigger
    expect(
      replaceSecrets(input, [
        "secretsecretsecret",
        "r;0;0.+t",
        "r;1;0+",
      ]).indexOf("00001111")
    ).toBe(-1);
  });

  test("line numbers", () => {
    const input = "LineX\nLineY";
    const result = lineNumber(input);

    const resultLines = result.split("\n");
    expect(resultLines.length).toBe(input.split("\n").length);
    for (let i = 0; i < resultLines.length; i++) {
      const line = resultLines[i];
      expect(line.indexOf("" + (i + 1))).toBeGreaterThan(-1);
    }
  });
});
