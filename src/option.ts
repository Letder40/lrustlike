abstract class OptionAbstract<T> {
  isSome(): this is SomeVariant<T> {
    return this instanceof SomeVariant
  };

  isNone(): this is NoneVariant {
    return this instanceof NoneVariant
  };

  and<U>(other: Option<U>): Option<U> {
    return this.isSome()
      ? other
      : new NoneVariant()
  }

  or<U>(other: Option<U>): Option<U | T> {
    return this.isSome()
      ? this
      : other
  }

  private _unwrap(m?: string): T {
    if (this.isSome()) {
      return this.value
    }

    throw new Error(m)
  }

  unwrap(): T { return this._unwrap() }
  expect(m: string): T { return this._unwrap(m) }

  unwrapOr<U> (v: U): T | U {
    return this.isSome() ? this.value : v
  }

  unwrapOrElse<U> (f: () => U): T | U {
    return this.isSome() ? this.value : f()
  }

  andThen<U> (thenFn: (v: T) => Option<U>): Option<U> {
    return this.isSome()
      ? thenFn(this.value)
      : new NoneVariant()
  }

  orElse<U> (elseFn: () => Option<U>): Option<T | U> {
    return this.isSome()
      ? this
      : elseFn()
  }

  map<U> (mapFn: (v: T) => U): Option<U> {
    return this.isSome()
      ? new SomeVariant(mapFn(this.value))
      : new NoneVariant()
  }

  mapOr<U> (fallback: U, mapFn: (v: T) => U): U {
    return this.isSome()
      ? mapFn(this.value)
      : fallback
  }

  mapOrElse<U> (fallback: () => U, mapFn: (v: T) => U): U {
    return this.isSome()
      ? mapFn(this.value)
      : fallback()
  }

  isSomeAnd (predicate: (v: T) => boolean): boolean {
    return this.isSome() && predicate(this.value)
  }

  isNoneOr (predicate: (v: T) => boolean): boolean {
    return this.isNone() ||
      (this.isSome()) && predicate(this.value)
  }

  filter (predicate: (v: T) => boolean): Option<T> {
    return this.isSome() && predicate(this.value)
      ? this
      : new NoneVariant()
  }

  inspect (inspectFn: (v: T) => void): this {
    if (this.isSome()) inspectFn(this.value);
    return this;
  }

  zip<U> (other: Option<U>): Option<[T, U]> {
    if (this.isSome() && other.isSome())
      return new SomeVariant([this.value, other.value]);
    else
      return new NoneVariant();
  }

  zipWith<U, R> (other: Option<U>, zipFn: (a: T, b: U) => R): Option<R> {
    if (this.isSome() && other.isSome())
      return new SomeVariant(zipFn(this.value, other.value));
    else
      return new NoneVariant();
  }

  flatten<U> (this: Option<Option<U>>): Option<U> {
    return this.isSome()
      ? this.value
      : this
  }
}

class SomeVariant<T> extends OptionAbstract<T> {
  constructor(readonly value: T){
    super()
  }
}
class NoneVariant extends OptionAbstract<never> {}

export type Option<T> = SomeVariant<T> | NoneVariant
export const Some = <T>(v: T): Option<T> => new SomeVariant(v)
export const None = (): Option<never> => new NoneVariant()
