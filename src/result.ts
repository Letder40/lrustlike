abstract class ResultMethods<T, E> {
  isOk(this: Result<T, E>): this is OkVariant<T> {
    return this instanceof OkVariant
  }

  isErr(this: Result<T, E>): this is ErrVariant<E> {
    return this instanceof ErrVariant
  }

  isOkAnd(this: Result<T, E>, fn: (value: T) => void): boolean {
    if (this instanceof OkVariant) {
      fn(this.value)
      return true
    }
    return false
  }

  isErrAnd(this: Result<T, E>, fn: (value: E) => void): boolean {
    if (this instanceof ErrVariant) {
      fn(this.error)
      return true
    }
    return false
  }

  expect(this: Result<T, E>, msg: string): T {
    if (this instanceof ErrVariant) {
      throw new Error(`${msg} ${String(this.error)}`)
    }
    return this.value
  }

  unwrap(this: Result<T, E>): T {
    if (this instanceof ErrVariant) {
      throw new Error(`Tried to unwrap Err: ${String(this.error)}`)
    }
    return this.value
  }

  match<R>(
    this: Result<T, E>,
    { Ok, Err }: {Ok: (v: T) => R, Err: (E: E) => R }
  ): R {
    if (this instanceof OkVariant) {
      return Ok(this.value)
    }
    return Err(this.error)
  }
}

class OkVariant<T> extends ResultMethods<T, never> {
  readonly value: T
  constructor(value: T) {
    super()
    this.value = value
  }
}

export const Ok = <T>(v: T) => new OkVariant(v)

class ErrVariant<E> extends ResultMethods<never, E> {
  readonly error: E
  constructor(error: E) {
    super()
    this.error = error
  }
}

export const Err = <E>(e: E) => new ErrVariant(e)

export type Result<T, E> = OkVariant<T> | ErrVariant<E>
