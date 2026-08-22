class OptionAbstract {
    isSome() {
        return this instanceof SomeVariant;
    }
    ;
    isNone() {
        return this instanceof NoneVariant;
    }
    ;
    and(other) {
        return this.isSome()
            ? other
            : new NoneVariant();
    }
    or(other) {
        return this.isSome()
            ? this
            : other;
    }
    _unwrap(m) {
        if (this.isSome()) {
            return this.value;
        }
        throw new Error(m);
    }
    unwrap() { return this._unwrap(); }
    expect(m) { return this._unwrap(m); }
    unwrapOr(v) {
        return this.isSome() ? this.value : v;
    }
    unwrapOrElse(f) {
        return this.isSome() ? this.value : f();
    }
    andThen(thenFn) {
        return this.isSome()
            ? thenFn(this.value)
            : new NoneVariant();
    }
    orElse(elseFn) {
        return this.isSome()
            ? this
            : elseFn();
    }
    map(mapFn) {
        return this.isSome()
            ? new SomeVariant(mapFn(this.value))
            : new NoneVariant();
    }
    mapOr(fallback, mapFn) {
        return this.isSome()
            ? mapFn(this.value)
            : fallback;
    }
    mapOrElse(fallback, mapFn) {
        return this.isSome()
            ? mapFn(this.value)
            : fallback();
    }
    isSomeAnd(predicate) {
        return this.isSome() && predicate(this.value);
    }
    isNoneOr(predicate) {
        return this.isNone() ||
            (this.isSome()) && predicate(this.value);
    }
    filter(predicate) {
        return this.isSome() && predicate(this.value)
            ? this
            : new NoneVariant();
    }
    inspect(inspectFn) {
        if (this.isSome())
            inspectFn(this.value);
        return this;
    }
    zip(other) {
        if (this.isSome() && other.isSome())
            return new SomeVariant([this.value, other.value]);
        else
            return new NoneVariant();
    }
    zipWith(other, zipFn) {
        if (this.isSome() && other.isSome())
            return new SomeVariant(zipFn(this.value, other.value));
        else
            return new NoneVariant();
    }
    flatten() {
        return this.isSome()
            ? this.value
            : this;
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
