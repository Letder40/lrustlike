# Rust Types for TypeScript

Type implementations for TypeScript inspired by Rust. They provide a typed way
to handle success, errors, and optional values without throwing, while still
giving you escape hatches like `unwrap` and `expect` when needed. Just don't use
`unwrap` in production code!

## Implemented

- Result
- Option

## API

Constructors are functions, and every operation is available as a method on the
returned `Result` or `Option`. The API has no external dependencies.

### Constructors

- `Result`: `Ok(value)`, `Err(error)`
- `Option`: `Some(value)`, `None()`

### Checking and matching

- `Result`: `isOk`, `isErr`, `isOkAnd`, `isErrAnd`, `match`
- `Option`: `isSome`, `isNone`, `isSomeAnd`, `isNoneOr`, `match`

The type guards narrow the variant, so `value` or `error` can be accessed safely.
`match` handles both variants and returns the selected branch's value.

### Transformations 

- `Result`: `map`, `mapErr`, `mapOr`, `mapOrElse`, `flatten`
- `Option`: `map`, `mapOr`, `mapOrElse`, `filter`, `zip`, `zipWith`, `flatten`

### Chaining

- `Result`: `and`, `andThen`, `or`, `orElse`
- `Option`: `and`, `andThen`, `or`, `orElse`

### Extracting values

- `Result`: `unwrap`, `expect`, `unwrapOr`, `unwrapOrElse`
- `Option`: `unwrap`, `expect`, `unwrapOr`, `unwrapOrElse`

`unwrap` and `expect` throw when called on `Err` or `None`; prefer exhaustive
handling or a fallback in production code.

### Others

- `Result`: `inspect`, `inspectErr`
- `Option`: `inspect` 

## Basic Usage

### Result

```ts
import { type Result, Ok, Err } from "lrustlike";

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
  Ok: v => `valid: ${v}`,
  Err: e => `invalid: ${e}`,
});
```

Using `expect` and `unwrap` (not recommended for production):

```ts
const x = parseIntResult("10").expect("expected an int");
const y = parseIntResult("oops").unwrap();
```

Using `isOkAnd` and `isErrAnd`:

```ts
const isPositive = parseIntResult("7").isOkAnd(value => value > 0);
const isInvalidNumber = parseIntResult("abc").isErrAnd(error =>
  error.includes("not a number"),
);
```

### Option

```ts
import { type Option, Some, None } from "lrustlike";

function findUserName(id: number): Option<string> {
  return id === 1 ? Some("Ferris") : None();
}

const name = findUserName(1);

if (name.isSome()) {
  console.log("user:", name.value);
} else {
  console.log("user not found");
}
```

Using `match` for exhaustive handling:

```ts
const greeting = findUserName(1).match({
  Some: name => `Hello, ${name}!`,
  None: () => "Hello, stranger!",
});
```

Transforming a value and providing a fallback:

```ts
const upperName = findUserName(1).map(name => name.toUpperCase());
const displayName = findUserName(2).unwrapOr("Anonymous");
```
