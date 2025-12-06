declare abstract class ResultMethods<T, E> {
    isOk(this: Result<T, E>): this is OkVariant<T>;
    isErr(this: Result<T, E>): this is ErrVariant<E>;
    isOkAnd(this: Result<T, E>, fn: (value: T) => void): boolean;
    isErrAnd(this: Result<T, E>, fn: (value: E) => void): boolean;
    expect(this: Result<T, E>, msg: string): T;
    unwrap(this: Result<T, E>): T;
    match<R>(this: Result<T, E>, { Ok, Err }: {
        Ok: (v: T) => R;
        Err: (E: E) => R;
    }): R;
}
declare class OkVariant<T> extends ResultMethods<T, never> {
    readonly value: T;
    constructor(value: T);
}
export declare const Ok: <T>(v: T) => OkVariant<T>;
declare class ErrVariant<E> extends ResultMethods<never, E> {
    readonly error: E;
    constructor(error: E);
}
export declare const Err: <E>(e: E) => ErrVariant<E>;
export type Result<T, E> = OkVariant<T> | ErrVariant<E>;
export {};
