abstract class OptionAbstract<T> {
  isSome(): this is SomeVariant<T> {
    return this instanceof SomeVariant
  };

  isNone(): this is NoneVariant {
    return this instanceof NoneVariant
  };

  isSomeAnd(predicate: (v: T) => boolean) {
    return this.isSome() && predicate(this.value)
  }

  isNoneOr(predicate: (v: T) => boolean): boolean {
    return (this.isNone() || (this.isSome()) && predicate(this.value))
  }

  and<U>(other: Option<U>): Option<U> {
    return this.match({
      Some: () => other,
      None: () => None(),
    })
  }

  andThen<U>(thenFn: (v: T) => Option<U>): Option<U> {
    return this.match({
      Some: (v) => thenFn(v),
      None: () => None(),
    })
  }

  or<U>(this: Option<T>, other: Option<U>): Option<U | T> {
    return this.match({
      Some: () => this,
      None: () => other,
    })
  }

  orElse<U>(this: Option<T>, elseFn: () => Option<U>): Option<T | U> {
    return this.match({
      Some: () => this,
      None: () => elseFn(),
    })
  }

  private _unwrap(m?: string): T {
    return this.match({
      Some: (v) => v,
      None: () => {throw new Error(m ? m : "Tried to unwrap None")},
    })
  }

  unwrap(): T {
      return this._unwrap()
  }

  expect(m: string): T {
      return this._unwrap(m)
  }

  unwrapOr<U>(v: U): T | U {
    return this.match({
      Some: (v) => v,
      None: () => v,
    })
  }

  unwrapOrElse<U>(f: () => U): T | U {
    return this.match({
      Some: (v) => v,
      None: () => f(),
    })
  }

  map<U>(mapFn: (v: T) => U): Option<U> {
    return this.match({
      Some: (v) => Some(mapFn(v)),
      None: () => None(),
    })
  }

  mapOr<U>(fallback: U, mapFn: (v: T) => U): U {
    return this.match({
      Some: (v) => mapFn(v),
      None: () => fallback,
    })
  }

  mapOrElse<U>(fallback: () => U, mapFn: (v: T) => U): U {
    return this.match({
      Some: (v) => mapFn(v),
      None: () => fallback(),
    })
  }

  filter(predicate: (v: T) => boolean): Option<T> {
    return this.isSome() && predicate(this.value)
      ? this
      : None()
  }

  inspect(inspectFn: (v: T) => void): this {
    if (this.isSome()) inspectFn(this.value);
    return this;
  }

  zip<U>(other: Option<U>): Option<[T, U]> {
    return this.isSome() && other.isSome()
      ? Some([this.value, other.value])
      : None();
  }

  zipWith<U, R>(other: Option<U>, zipFn: (a: T, b: U) => R): Option<R> {
    return this.isSome() && other.isSome()
      ? Some(zipFn(this.value, other.value))
      : None();
  }

  flatten<U>(this: Option<Option<U>>): Option<U> {
    return this.match({
      Some: (v) => v,
      None: () => None(),
    })
  }

  match<R, S>({
      Some,
      None
    }: {
      Some: (v: T) => R,
      None: () => S
    }): R | S
  {
    return this.isSome()
      ? Some(this.value)
      : None()
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
