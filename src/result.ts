abstract class ResultAbstract<T, E> {
  isOk(): this is OkVariant<T, E> {
    return this instanceof OkVariant
  }

  isErr(): this is ErrVariant<T, E> {
    return this instanceof ErrVariant
  }

  isOkAnd(fn: (value: T) => boolean): boolean {
    return this.isOk() && fn(this.value)
  }

  isErrAnd(fn: (value: E) => boolean): boolean {
    return this.isErr() && fn(this.error)
  }

  and<U>(other: Result<U, E>): Result<U, E> {
    return this.match({
      Ok: (_) => other,
      Err: (e) => Err(e)
    })
  }

  andThen<U>(thenFn: (v: T) => Result<U, E>): Result<U, E> {
    return this.match({
      Ok:  (v) => thenFn(v),
      Err: (e) => Err(e)
    })
  }

  or<F>(other: Result<T, F>): Result<T, F> {
    return this.match({
      Ok:  (v) => Ok(v),
      Err: (_) => other
    })
  }

  orElse<F>(elseFn: (e: E) => Result<T, F>): Result<T, F> {
    return this.match({
      Ok:  (v) => Ok(v),
      Err: (e: E) => elseFn(e)
    })
  }

  unwrap(): T {
    return this.match({
      Ok: v => v,
      Err: e => {
        throw new Error(`Tried to unwrap Err: ${String(e)}`)
      }
    })
  }

  expect(msg: string): T {
    return this.match({
      Ok: v => v,
      Err: e => {
        throw new Error(`${msg}: ${String(e)}`)
      }
    })
  }

  unwrapOr(v: T): T {
    return this.isOk() ? this.value : v
  }

  unwrapOrElse(fn: (e: E) => T): T {
    return this.match({
      Ok:  (v) => v,
      Err: (e) => fn(e)
    })
  }

  map<U>(mapFn: (v: T) => U): Result<U, E> {
    return this.match({
      Ok:  (v) => Ok<U, E>(mapFn(v)),
      Err: (e) => Err<U, E>(e)
    })
  }

  mapOr<U>(fallback: U, mapFn: (v: T) => U): U {
    return this.match({
      Ok:  (v) => mapFn(v),
      Err: (_) => fallback,
    })
  }

  mapOrElse<U>(fallback: (e: E) => U, mapFn: (v: T) => U): U {
    return this.match({
      Ok:  (v) => mapFn(v),
      Err: (e) => fallback(e),
    })
  }

  mapErr<F>(mapFn: (e: E) => F): Result<T, F> {
    return this.match({
      Ok:  (v) => Ok<T, F>(v),
      Err: (e) => Err<T, F>(mapFn(e))
    })
  }

  inspect(inspectFn: (v: T) => void): this {
    if (this.isOk()) inspectFn(this.value);
    return this;
  }

  inspectErr(inspectFn: (v: E) => void): this {
    if (this.isErr()) inspectFn(this.error);
    return this;
  }

  flatten<U>(this: Result<Result<U, E>, E>): Result<U, E> {
    return this.match({
      Ok:  (v) => v,
      Err: (e) => Err(e),
    })
  }

  match<R, S>({
      Ok,
      Err
    }: {
      Ok: (v: T) => R,
      Err: (E: E) => S
    }): R | S
  {
    if (this.isOk()) return Ok(this.value);
    else if (this.isErr()) return Err(this.error);
    else throw new Error("unreachable");
  }

}

class OkVariant<T, E> extends ResultAbstract<T, E> {
  readonly value: T
  constructor(value: T) {
    super()
    this.value = value
  }
}

class ErrVariant<T, E> extends ResultAbstract<T, E> {
  readonly error: E
  constructor(error: E) {
    super()
    this.error = error
  }
}

export type Result<T, E> =
  | OkVariant<T, E>
  | ErrVariant<T, E>
export type Ok<T, E> = OkVariant<T, E>
export type Err<T, E> = ErrVariant<T, E>

export function Ok<T>(v: T): Ok<T, never>
export function Ok<T, E>(v: T): Ok<T, E>
export function Ok<T, E>(v: T): Result<T, E> {
  return new OkVariant(v)
}

export function Err<E>(e: E): Err<never, E>
export function Err<T, E>(e: E): Err<T, E>
export function Err<T, E>(e: E): Result<T, E> {
  return new ErrVariant(e)
}

export const Result = {
  Ok,
  Err
} as const
