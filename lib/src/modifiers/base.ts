export function fasttime(time: number | Date): string {
  const d = typeof time == "number" ? new Date(time) : time;
  return fullISODate({ d, showDate: false }).split("T")[1];
}

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
