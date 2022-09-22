import { Logger } from "./logger/Logger";
import { listenGC } from "./logger/ShortLogger";
import { addOutput } from "./outputs/output_registery";
import { SimpleConsoleOutput } from "./outputs/simple_console";

function logA() {
  let anchor: any | null = { a: 2 };
  let logger: Logger | null = new Logger({});
  logger.l("Hi, Im in a function!");
  anchor = null;
}
setTimeout(logA, 1 * 1000);

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
