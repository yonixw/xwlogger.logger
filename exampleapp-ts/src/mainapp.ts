import { XWLogger } from "@xwlogger/logger";
import { myLogPredefiend, myLogTypes } from "./i18n-dict";

const sleep = (ms: number) => {
  return new Promise((ok, _) => {
    setTimeout(ok, ms);
  });
};

const main = async () => {
  await sleep(200);
  const z = new XWLogger<myLogTypes>().init({
    geti18Dict: async (lang: string) => myLogPredefiend[lang],
  });
  await z.confignow();

  z.log18("ERROR7", { param1: 123312 }, "alohaa");
};

main()
  .then(() => {
    console.log("[MAIN DONE]");
  })
  .catch((e) => {
    console.error("[MAIN ERR]", e);
  });
