export type Configs = "plugins";

const getConfig = (configname: Configs) =>
  process.env["npm_package" + "_config" + "_xwlogger" + "_" + configname];

console.log("[XWLOGGER POSTINSTALL DONE]");
