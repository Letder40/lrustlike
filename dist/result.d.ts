declare abstract class ResultAbstract<T, E> {
    isOk(): this is OkVariant<T, E>;
    isErr(): this is ErrVariant<T, E>;
    isOkAnd(fn: (value: T) => boolean): boolean;
    isErrAnd(fn: (value: E) => boolean): boolean;
    and<U>(other: Result<U, E>): Result<U, E>;
    andThen<U>(thenFn: (v: T) => Result<U, E>): Result<U, E>;
    or<F>(other: Result<T, F>): Result<T, F>;
    orElse<F>(elseFn: (e: E) => Result<T, F>): Result<T, F>;
    unwrap(): T;
    expect(msg: string): T;
    unwrapOr(v: T): T;
    unwrapOrElse(fn: (e: E) => T): T;
    map<U>(mapFn: (v: T) => U): Result<U, E>;
    mapOr<U>(fallback: U, mapFn: (v: T) => U): U;
    mapOrElse<U>(fallback: (e: E) => U, mapFn: (v: T) => U): U;
    mapErr<F>(mapFn: (e: E) => F): Result<T, F>;
    inspect(inspectFn: (v: T) => void): this;
    inspectErr(inspectFn: (v: E) => void): this;
    flatten<U>(this: Result<Result<U, E>, E>): Result<U, E>;
    match<R>({ Ok, Err }: {
        Ok: (v: T) => R;
        Err: (E: E) => R;
    }): R;
}
declare class OkVariant<T, E> extends ResultAbstract<T, E> {
    readonly value: T;
    constructor(value: T);
}
declare class ErrVariant<T, E> extends ResultAbstract<T, E> {
    readonly error: E;
    constructor(error: E);
}
export type Result<T, E> = OkVariant<T, E> | ErrVariant<T, E>;
export declare function Ok<T>(v: T): Result<T, never>;
export declare function Ok<T, E>(v: T): Result<T, E>;
export declare function Err<E>(e: E): Result<never, E>;
export declare function Err<T, E>(e: E): Result<T, E>;
export {};
//# sourceMappingURL=result.d.ts.map