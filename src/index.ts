import { Logger } from "./logger/Logger";
import { addOutput } from "./outputs/output_registery";
import { SimpleConsoleOutput } from "./outputs/simple_console";

let logger: Logger | null = new Logger({});

logger = new Logger({ output: "console22" });
logger.l("Hi!");

addOutput("console-color", () => new SimpleConsoleOutput({ useColor: true }));
logger = new Logger({ output: "console-color" });
const { c, e, w, i, l, v, d } = logger.mini();
c("Critical info!");
logger.c("Ciritical FULL");

function B() {
  let logger = new Logger({ output: "console-color" });
  const { c, e, w, i, l, v, d } = logger.micro();
  c`This is an example error of ${1 + 2}`;
}

function A() {
  l("At A!", {}, [1, 2, 3]);
  B();
}

A();

/* setInterval(() => {
  console.log(
    "Terminal size: " +
      (process.stdout.columns || 40) +
      "x" +
      (process.stdout.rows || 40)
  );
}, 5000);
 */
