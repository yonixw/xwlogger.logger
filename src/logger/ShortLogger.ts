// https://stackoverflow.com/a/66723580/1997873
// FinalizationRegistry is kinda complementry
//           to WeakRef which comes undefined on GC

const listener = new FinalizationRegistry((tag: any) => {
  tag();
});

export function listenGC(obj: any, tag: any) {
  // worked fine for both object {} and classes (I thought prototype might block it?)
  listener.register(obj, tag);
}
