export type metamodifiers =
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

// human readable time
export const fasttime = (time: number): string => {
  const d = new Date(time);
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const ms = d.getMilliseconds();
  const hms = `${h}:${m}:${s}.${ms}`;
  return hms;
};

// human readable date
export const fastdate = (time: number): string => {
  const d = new Date(time);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const dd = d.getDate();
  const dmy = `${y}-${m}-${dd}`;
  return dmy;
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

// pad string with zeros
export const pad = (astring: string, n: number, char: string = "0"): string => {
  const len = astring.length;
  const pad = char.repeat(n - len);
  const padded = pad + astring;
  return padded;
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
export const replaceSecrets = (astring: string, secrets: string[]): string => {
  const len = secrets.length;
  const secret = secrets.map((secret) => {
    const regex = new RegExp(secret, "g");
    const replace = "***ENV***";
    const replaced = astring.replace(regex, replace);
    return replaced;
  });
  const replaced = secret.reduce((a, b) => a);
  return replaced;
};

/*
Eval args:
cc = 
  (a,b,c)=>
  console.log(
      a,b,
      eval('typeof ' + c + ' !== "undefined" ? ' + c + ' : "undefined ' + c + '"')
  )
*/
