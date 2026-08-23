class ResultAbstract {
    isOk() {
        return this instanceof OkVariant;
    }
    isErr() {
        return this instanceof ErrVariant;
    }
    isOkAnd(fn) {
        return this.isOk() && fn(this.value);
    }
    isErrAnd(fn) {
        return this.isErr() && fn(this.error);
    }
    and(other) {
        return this.match({
            Ok: (_) => other,
            Err: (e) => Err(e)
        });
    }
    andThen(thenFn) {
        return this.match({
            Ok: (v) => thenFn(v),
            Err: (e) => Err(e)
        });
    }
    or(other) {
        return this.match({
            Ok: (v) => Ok(v),
            Err: (_) => other
        });
    }
    orElse(elseFn) {
        return this.match({
            Ok: (v) => Ok(v),
            Err: (e) => elseFn(e)
        });
    }
    unwrap() {
        return this.match({
            Ok: v => v,
            Err: e => {
                throw new Error(`Tried to unwrap Err: ${String(e)}`);
            }
        });
    }
    expect(msg) {
        return this.match({
            Ok: v => v,
            Err: e => {
                throw new Error(`${msg}: ${String(e)}`);
            }
        });
    }
    unwrapOr(v) {
        return this.isOk() ? this.value : v;
    }
    unwrapOrElse(fn) {
        return this.match({
            Ok: (v) => v,
            Err: (e) => fn(e)
        });
    }
    map(mapFn) {
        return this.match({
            Ok: (v) => Ok(mapFn(v)),
            Err: (e) => Err(e)
        });
    }
    mapOr(fallback, mapFn) {
        return this.match({
            Ok: (v) => mapFn(v),
            Err: (_) => fallback,
        });
    }
    mapOrElse(fallback, mapFn) {
        return this.match({
            Ok: (v) => mapFn(v),
            Err: (e) => fallback(e),
        });
    }
    mapErr(mapFn) {
        return this.match({
            Ok: (v) => Ok(v),
            Err: (e) => Err(mapFn(e))
        });
    }
    inspect(inspectFn) {
        if (this.isOk())
            inspectFn(this.value);
        return this;
    }
    inspectErr(inspectFn) {
        if (this.isErr())
            inspectFn(this.error);
        return this;
    }
    flatten() {
        return this.match({
            Ok: (v) => v,
            Err: (e) => Err(e),
        });
    }
    match({ Ok, Err }) {
        if (this.isOk())
            return Ok(this.value);
        else if (this.isErr())
            return Err(this.error);
        else
            throw new Error("unreachable");
    }
}
class OkVariant extends ResultAbstract {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
}
class ErrVariant extends ResultAbstract {
    error;
    constructor(error) {
        super();
        this.error = error;
    }
}
export function Ok(v) {
    return new OkVariant(v);
}
export function Err(e) {
    return new ErrVariant(e);
}
