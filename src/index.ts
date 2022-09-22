import { Logger } from "./logger/Logger";
import { addOutput } from "./outputs/output_registery";
import { SimpleConsoleOutput } from "./outputs/simple_console";

const logger = new Logger({});
logger.l("Hi!");

const logger2 = new Logger({ output: "console22" });
logger2.l("Hi!");

addOutput("console-color", () => new SimpleConsoleOutput({ useColor: true }));
const logger3 = new Logger({ output: "console-color" });
logger3.l("Hi!");
