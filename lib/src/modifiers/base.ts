export type metamodifiers =
  | "full.time"
  | "hm.time"
  | "dmy.time"
  | "delta"
  | "parent.delta"
  | "line.num"
  | "no.color"
  | "mask.every=="
  | "mask.bound=="
  | "onelines.tart"
  | "oneline.end"
  | "oneline.mid"
  | "name.args" // not in arrow
  | "stack.top==" // @todo consider WebWorker case, need to be calc on log call side
  | "max.cols==";
export type MetaModifierItem = {
  modifier: metamodifiers;
  extra: string | null;
};

// human readable time
export const hmtime = (time: number): string => {
  const d = new Date(time);
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const ms = d.getMilliseconds();
  const hms = `${h}:${m}:${s}.${ms}`;
  return hms;
};

// mask string keep center of string
