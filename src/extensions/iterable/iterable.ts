import { type Option, Some, None } from "../../option.js"

export interface IterableExtended<T> {
  findOption(this: Iterable<T>, predicate: (v: T) => boolean): Option<T>
}

export function findOption<T>(this: Iterable<T>, predicate: (v: T) => boolean): Option<T> {
  for (const value of this) {
    if (predicate(value)) return Some(value)
  }
  return None()
}
