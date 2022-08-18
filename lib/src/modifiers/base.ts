/*
[
  [
  "scope" , [
      ['o0',['opt1',1,2,3]],
      ['m0',['opt1',1,2,3]],
    ]
  ],
  [
  "scope" , [
      ['o0',['opt1',1,2,3]],
      ['m0',['opt1',1,2,3]],
    ]
  ],

]

*/

export interface IModifier {
  /**
   * Key all keys of this modifier
   * @returns Keys
   * @example ["m0","modif.time"]
   */
  getKeys(): string[];

  /**
   * All optional options in order
   * @returns Options
   * @example ["maxLength","async"]
   */
  getOptions(): string[];

  /**
   * Get wrapper for pre-processing log
   * @param options Options for the wrapper in an array form
   */
  getWrapper(options: Array<string | number>): (text: string) => string;
}

export class ModifierFastTime implements IModifier {
  getKeys(): string[] {
    return ["m0", "m.fast.time"];
  }

  getOptions(): string[] {
    return [];
  }

  getWrapper(options: (string | number)[]): (text: string) => string {
    return (text) => `${ModifierFastTime.fasttime(new Date())} ${text}`;
  }

  /**
   * human readable time
   * @param time timestamp or Date
   * @returns string
   */
  static fasttime(time: number | Date): string {
    const d = typeof time == "number" ? new Date(time) : time;
    return fullISODate({ d, showDate: false }).split("T")[1];
  }
}

const modifier = (() => {
  return class {};
})();

// pad string with zeros
export const pad0 = (
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
 * Get full ISO date string
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

// human readable date
export const fastdate = (time: number | Date): string => {
  const d = typeof time == "number" ? new Date(time) : time;
  return fullISODate({ d, showTime: false }).split("T")[0];
};

// print last lines from error  stacktrace
export const stacktrace = (stack?: string[], lines: number = 10): string => {
  if (!stack) {
    stack = (new Error().stack || "").split("\n");
    if (stack.length > 2) {
      stack = stack.slice(2, stack.length - 1); // Error + this func
    }
  }

  const stacklist = stack.map((line) => line.replace(/^\s*at\s*/, ""));

  const stacktrace = stacklist.slice(0, lines);
  return stacktrace.join("\n");
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
  const line = lines.map((line, i) => `L#${pad0(`${i + 1}`, 4)}) ${line}`);
  const lineText = line.join("\n");
  return lineText;
};

const sortASC = (a: number, b: number) => a - b;
const sortDESC = (a: number, b: number) => b - a;

// replace secrets in string from shortest to longest
export const replaceSecrets = (
  astring: string,
  secrets: string[],
  replace = "*xENV*"
): string => {
  const regexes = secrets
    .filter((e) => e.split(";").length === 3 && e.startsWith("r;"))
    .map((e) => {
      let rx = e.split(";");
      return { order: parseInt(rx[1]) || 0, regx: rx[2] };
    })
    .sort((a, b) => sortASC(a.order, b.order));

  const texts = secrets
    .filter((e) => e.split(";").length !== 3 || !e.startsWith("r;"))
    .sort((a, b) => sortDESC(a.length, b.length));

  let replaced = astring;
  regexes.map((rgx) => {
    const regex = new RegExp(rgx.regx, "ig");
    replaced = replaced.replace(regex, replace);
  });
  texts.map((secret) => {
    const regex = new RegExp(secret, "ig");
    replaced = replaced.replace(regex, replace);
  });
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
