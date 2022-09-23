import { Logger } from "./logger/Logger";
import { addOutput } from "./outputs/output_registery";
import { SimpleConsoleOutput } from "./outputs/simple_console";

const laser = (strings: TemplateStringsArray, ...values: any[]) => {
  console.log({ strings, values });
  return String.raw({ raw: strings }, ...values);
};
console.log(laser`Hi ${2 + 3}! and ${"also"} this`);

/* function logA() {
  let ppp1 = 12344;

  let anchor: any | null = { a: 2 };
  let logger: Logger | null = new Logger({});
  logger.l2("Hi, Im in a function!");
  anchor = null;

  return ppp1;
}
setTimeout(logA, 1 * 1000); */

let logger: Logger | null = new Logger({});

logger = new Logger({ output: "console22" });
logger.l("Hi!");

addOutput("console-color", () => new SimpleConsoleOutput({ useColor: true }));
logger = new Logger({ output: "console-color" });
logger.l("Hi!");

logger.l("Hi!", "some other", "object");

const { l } = new Logger({ output: "console-color" }).mini();
l("Hello", 2);

setTimeout(() => console.log("done"), 25 * 1000);
