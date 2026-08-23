class OptionAbstract {
    isSome() {
        return this instanceof SomeVariant;
    }
    ;
    isNone() {
        return this instanceof NoneVariant;
    }
    ;
    isSomeAnd(predicate) {
        return this.isSome() && predicate(this.value);
    }
    isNoneOr(predicate) {
        return (this.isNone() || (this.isSome()) && predicate(this.value));
    }
    and(other) {
        return this.match({
            Some: () => other,
            None: () => None(),
        });
    }
    andThen(thenFn) {
        return this.match({
            Some: (v) => thenFn(v),
            None: () => None(),
        });
    }
    or(other) {
        return this.match({
            Some: () => this,
            None: () => other,
        });
    }
    orElse(elseFn) {
        return this.match({
            Some: () => this,
            None: () => elseFn(),
        });
    }
    _unwrap(m) {
        return this.match({
            Some: (v) => v,
            None: () => { throw new Error(m ? m : "Tried to unwrap None"); },
        });
    }
    unwrap() {
        return this._unwrap();
    }
    expect(m) {
        return this._unwrap(m);
    }
    unwrapOr(v) {
        return this.match({
            Some: (v) => v,
            None: () => v,
        });
    }
    unwrapOrElse(f) {
        return this.match({
            Some: (v) => v,
            None: () => f(),
        });
    }
    map(mapFn) {
        return this.match({
            Some: (v) => Some(mapFn(v)),
            None: () => None(),
        });
    }
    mapOr(fallback, mapFn) {
        return this.match({
            Some: (v) => mapFn(v),
            None: () => fallback,
        });
    }
    mapOrElse(fallback, mapFn) {
        return this.match({
            Some: (v) => mapFn(v),
            None: () => fallback(),
        });
    }
    filter(predicate) {
        return this.isSome() && predicate(this.value)
            ? this
            : None();
    }
    inspect(inspectFn) {
        if (this.isSome())
            inspectFn(this.value);
        return this;
    }
    zip(other) {
        return this.isSome() && other.isSome()
            ? Some([this.value, other.value])
            : None();
    }
    zipWith(other, zipFn) {
        return this.isSome() && other.isSome()
            ? Some(zipFn(this.value, other.value))
            : None();
    }
    flatten() {
        return this.match({
            Some: (v) => v,
            None: () => None(),
        });
    }
    match({ Some, None }) {
        return this.isSome()
            ? Some(this.value)
            : None();
    }
}
class SomeVariant extends OptionAbstract {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
}
class NoneVariant extends OptionAbstract {
}
export const Some = (v) => new SomeVariant(v);
export const None = () => new NoneVariant();
