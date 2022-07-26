export type metamodifiers =
  | "gmt=="
  | "full.time"
  | "hmsm.time"
  | "dmy.date"
  | "delta"
  | "parent.delta"
  | "line.num"
  | "no.color"
  | "mask.every=="
  | "mask.bound=="
  | "smart.mask" // env + every 6 and keep whitespaces A,a,0
  | "oneline.tart"
  | "oneline.end"
  | "oneline.mid"
  | "eval.args==" // azAz_09 only
  | "name.args" // not in arrow
  | "stack.top==" // @todo consider WebWorker case, need to be calc on log call side
  | "max.cols==";
export type MetaModifierItem = {
  modifier: metamodifiers;
  extra: string | null;
};

// pad string with zeros
export const pad = (
  astring: string | number,
  n: number,
  char: string = "0"
): string => {
  const str = String(astring);
  const len = str.length;
  const pad = char.repeat(n - len);
  const padded = pad + str;
  return padded;
};

/**
 *
 * @param options utc - return in utc, otherwise return in local timezone
 * @returns ISO date string
 */
export function fullISODate(options?: {
  d?: Date;
  utc?: boolean;
  showDate?: boolean;
  showTime?: boolean;
}): string {
  const d = options?.d ?? new Date();
  const utc = options?.utc ?? false;
  const showDate = options?.showDate ?? true;
  const showTime = options?.showTime ?? true;

  let tzo = -d.getTimezoneOffset();
  let dif = tzo >= 0 ? "+" : "-";
  if (utc) {
    d.setMinutes(d.getMinutes() - tzo);
    tzo = 0;
    dif = "+";
  }
  const pad = function (num: number) {
    return (num < 10 ? "0" : "") + num;
  };

  let date = "skip-date";
  if (showDate) {
    date =
      d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  let time = "skip-time";
  if (showTime) {
    time =
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes()) +
      ":" +
      pad(d.getSeconds()) +
      dif +
      pad(Math.floor(Math.abs(tzo) / 60)) +
      ":" +
      pad(Math.abs(tzo) % 60);
  }

  return date + "T" + time;
}

// human readable time
export const fasttime = (time: number | Date): string => {
  const d = typeof time == "number" ? new Date(time) : time;
  return fullISODate({ d, showDate: false }).split("T")[1];
};

// human readable date
export const fastdate = (time: number | Date): string => {
  const d = typeof time == "number" ? new Date(time) : time;
  return fullISODate({ d, showTime: false }).split("T")[0];
};

// print last lines from error  stacktrace
export const stacktrace = (stack: string, lines: number): string[] => {
  const stacklist = stack
    .split("\n")
    .map((line) => line.replace(/^\s*at\s*/, ""));
  const start = Math.max(stacklist.length - lines, 0);
  const end = stacklist.length;
  const stacktrace = stacklist.slice(start, end);
  return stacktrace;
};

// show last n chars at the end of astring with elipsis
export const ellipsisStart = (astring: string, n: number): string => {
  n = n - 3;
  const len = astring.length;
  const start = Math.max(len - n, 0);
  const end = len;
  const ellipsis = "..." + astring.slice(start, end);
  return ellipsis;
};

// show first n chars at the start of astring with elipsis
export const ellipsisEnd = (astring: string, n: number): string => {
  n = n - 3;
  const len = astring.length;
  const start = 0;
  const end = Math.min(n, len);
  const ellipsis = astring.slice(start, end) + "...";
  return ellipsis;
};

// show middle n chars of astring with elipsis before and after
export const ellipsisMid = (astring: string, n: number): string => {
  n = n - 6;
  const len = astring.length;
  const start = Math.max(len - n, 0);
  const end = len;
  const ellipsis = "..." + astring.slice(start, end) + "...";
  return ellipsis;
};

// add line number for multiline text
export const lineNumber = (astring: string): string => {
  const lines = astring.split("\n");
  const len = lines.length;
  const line = lines.map((line, i) => `L#${pad(`${i + 1}`, 4)}) ${line}`);
  const lineText = line.join("\n");
  return lineText;
};

// replace secrets in string from shortest to longest
export const replaceSecrets = (
  astring: string,
  secrets: string[],
  replace = "*xENV*"
): string => {
  const len = secrets.length;
  const secret = secrets.map((secret) => {
    const regex = new RegExp(secret, "g");
    const replaced = astring.replace(regex, replace);
    return replaced;
  });
  const replaced = secret.reduce((a, b) => a);
  return replaced;
};

/*
Eval args:
- check only "azAZ09_-" in param name
cc = 
  (a,b,c)=>
  console.log(
      a,b,
      eval('typeof ' + c + ' !== "undefined" ? ' + c + ' : "undefined ' + c + '"')
  )
*/
