class ResultMethods {
    isOk() {
        return this instanceof OkVariant;
    }
    isErr() {
        return this instanceof ErrVariant;
    }
    isOkAnd(fn) {
        if (this instanceof OkVariant) {
            fn(this.value);
            return true;
        }
        return false;
    }
    isErrAnd(fn) {
        if (this instanceof ErrVariant) {
            fn(this.error);
            return true;
        }
        return false;
    }
    expect(msg) {
        if (this instanceof ErrVariant) {
            throw new Error(`${msg} ${String(this.error)}`);
        }
        return this.value;
    }
    unwrap() {
        if (this instanceof ErrVariant) {
            throw new Error(`Tried to unwrap Err: ${String(this.error)}`);
        }
        return this.value;
    }
    match({ Ok, Err }) {
        if (this instanceof OkVariant) {
            return Ok(this.value);
        }
        return Err(this.error);
    }
}
class OkVariant extends ResultMethods {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
}
export const Ok = (v) => new OkVariant(v);
class ErrVariant extends ResultMethods {
    error;
    constructor(error) {
        super();
        this.error = error;
    }
}
export const Err = (e) => new ErrVariant(e);
