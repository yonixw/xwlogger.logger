export type OptionalDictKeys<T> = { [K in keyof T]?: T[K] };

export type StringDict = { [key: string]: string };

export type AnyDict = { [key: string]: any };
