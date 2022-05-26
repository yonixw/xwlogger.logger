import { health, shlomo } from "@xwlogger/logger";

const sleep = (ms: number) => {
  return new Promise((ok, _) => {
    setTimeout(ok, ms);
  });
};

const main = async () => {
  await sleep(200);
  console.log(health(), shlomo);
};

main()
  .then(() => {
    console.log("[MAIN DONE]");
  })
  .catch((e) => {
    console.error("[MAIN ERR]", e);
  });
