# Result<T, E> for TypeScript

A small `Result<T, E>` implementation for TypeScript, inspired by Rust's `Result`.  
It provides a typed way to handle success and error without throwing, while still giving you escape hatches like `unwrap` and `expect` when needed.
Just don't use unwrap in production code!

## Features

- `Ok<T>` and `Err<E>` constructors
- Discriminated `Result<T, E>` type
- Type guards: `isOk()`, `isErr()`
- Helpers: `isOkAnd`, `isErrAnd`, `expect`, `unwrap`, `match`
- No external dependencies

## Basic Usage

```ts
import { Result, Ok, Err } from "./result";

function parseIntResult(s: string): Result<number, string> {
  const n = Number.parseInt(s, 10);
  return Number.isNaN(n) ? Err(`'${s}' is not a number`) : Ok(n);
}

const r = parseIntResult("42");

if (r.isOk()) {
  console.log("value:", r.value);
} else {
  console.log("error:", r.error);
}
```

Using `match` for exhaustive handling:

```ts
const msg = parseIntResult("100").match({
  ok: v => `valid: ${v}`,
  err: e => `invalid: ${e}`,
});
```

Using expect and unwrap (not recommended for production):

```ts
const x = parseIntResult("10").expect("expected an int");
const y = parseIntResult("oops").unwrap();
```

Using isOkAnd and isErrAnd:

```ts
parseIntResult("7").isOkAnd(v => console.log("got:", v));
parseIntResult("abc").isErrAnd(e => console.log("problem:", e));
```
