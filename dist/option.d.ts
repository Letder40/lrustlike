declare abstract class OptionAbstract<T> {
    isSome(): this is SomeVariant<T>;
    isNone(): this is NoneVariant;
    isSomeAnd(predicate: (v: T) => boolean): boolean;
    isNoneOr(predicate: (v: T) => boolean): boolean;
    and<U>(other: Option<U>): Option<U>;
    andThen<U>(thenFn: (v: T) => Option<U>): Option<U>;
    or<U>(this: Option<T>, other: Option<U>): Option<U | T>;
    orElse<U>(this: Option<T>, elseFn: () => Option<U>): Option<T | U>;
    private _unwrap;
    unwrap(): T;
    expect(m: string): T;
    unwrapOr<U>(v: U): T | U;
    unwrapOrElse<U>(f: () => U): T | U;
    map<U>(mapFn: (v: T) => U): Option<U>;
    mapOr<U>(fallback: U, mapFn: (v: T) => U): U;
    mapOrElse<U>(fallback: () => U, mapFn: (v: T) => U): U;
    filter(predicate: (v: T) => boolean): Option<T>;
    inspect(inspectFn: (v: T) => void): this;
    zip<U>(other: Option<U>): Option<[T, U]>;
    zipWith<U, R>(other: Option<U>, zipFn: (a: T, b: U) => R): Option<R>;
    flatten<U>(this: Option<Option<U>>): Option<U>;
    match<R, S>({ Some, None }: {
        Some: (v: T) => R;
        None: () => S;
    }): R | S;
}
declare class SomeVariant<T> extends OptionAbstract<T> {
    readonly value: T;
    constructor(value: T);
}
declare class NoneVariant extends OptionAbstract<never> {
}
export type Option<T> = SomeVariant<T> | NoneVariant;
export declare const Some: <T>(v: T) => Option<T>;
export declare const None: () => Option<never>;
export {};
//# sourceMappingURL=option.d.ts.map