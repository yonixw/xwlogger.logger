import { ellipsisEnd, ellipsisMid, ellipsisStart } from "./base";
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
});
