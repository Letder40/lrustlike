import { IterableExtended } from "./iterable/iterable.ts"

declare global {
  interface Array<T> extends IterableExtended<T> {}
  interface ReadonlyArray<T> extends IterableExtended<T> {}
  interface Set<T> extends IterableExtended<T> {}
  interface Map<K, V> extends IterableExtended<[K, V]> {}
}

export {}
