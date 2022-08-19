import { LogItem } from "../../core/log_item";
import {
  KnownConsoleProperties,
  KnownConsoleProperties_Enum,
} from "../../targets/console";
import {
  ellipsisEnd,
  ellipsisStart,
  finalApplyOneLine,
  OneLine_AllArgs,
  OneLine_AllArgsScheme,
} from "./one_line";

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

  test("auto", async () => {
    const logItem = new LogItem();
    logItem.baseMessage =
      "A very long text with a lot more than 25 characters that we want";

    const resultXYZ = await finalApplyOneLine(
      OneLine_AllArgsScheme.parse({
        _: "_",
      } as OneLine_AllArgs)
    );

    await resultXYZ(logItem, {});

    expect(logItem.baseMessage.length).toBe(25);
  });

  test("50% percent of 50=25", async () => {
    const logItem = new LogItem();
    logItem.baseMessage =
      "A very long text with a lot more than 25 characters that we want";

    const resultXYZ = await finalApplyOneLine(
      OneLine_AllArgsScheme.parse({
        _: "%",
        start: 1,
        toKeep: 50,
      } as OneLine_AllArgs)
    );

    await resultXYZ(logItem, {
      [KnownConsoleProperties[KnownConsoleProperties_Enum.VISIBLE_WIDTH]]: 50,
    });

    expect(logItem.baseMessage.length).toBe(25);
  });
});
