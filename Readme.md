# Rust Types for TypeScript

Type implementations for TypeScript inspired by Rust. They provide a typed way
to handle success, errors, and optional values without throwing, while still
giving you escape hatches like `unwrap` and `expect` when needed. Just don't use
`unwrap` in production code!

## Implemented Types

- Result
- Option

## Implemented methods by interface

### Iterables

- `findOption` (equivalent to Rust's `find`, returning `Option` instead of `undefined`)

## Types documentation

Constructors are functions, and every operation is available as a method on the
returned `Result` or `Option`. The API has no external dependencies.

### Constructors

- `Result`: `Ok(value)`, `Err(error)`, also available as `Result.Ok(value)`, `Result.Err(error)`
- `Option`: `Some(value)`, `None()`, also available as `Option.Some(value)`, `Option.None()`

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

## Method documentation

To install all extended methods eagerly as a side effect, import:

```ts
import "lrustlike/extensions/eager";
```

To install all extended methods lazily, import and call the installer:

```ts
import { installIterableMethods } from "lrustlike/extensions/lazy";

installIterableMethods();
```

Extensions can also be installed for a specific interface. Replace
`<interface>` with the lowercase interface name used in the path, and replace
`<Interface>` with its PascalCase name in the installer function. For example,
the `Iterable` interface uses `iterable` in import paths and `Iterable` in
function names.

### By interface

#### Eager installation

Importing the eager module installs every extension for that interface as a
side effect:

```ts
import "lrustlike/extensions/iterable/eager";
```

The path follows this pattern:

```text
lrustlike/extensions/<interface>/eager
```

#### Lazy installation

Import the interface installer from its lazy module and call it explicitly:

```ts
import { installIterableMethods } from "lrustlike/extensions/iterable/lazy";

installIterableMethods();
```

The import and installer names follow these patterns:

```text
lrustlike/extensions/<interface>/lazy
install<Interface>Methods
```

### By method

The lazy interface module also exports installers for individual methods. The
installer name follows the `install<MethodName>Method` pattern. For example, to
install only `findOption`:

```ts
import { installFindOptionMethod } from "lrustlike/extensions/iterable/lazy";

installFindOptionMethod();
```

## Basic Usage

### Result

```ts
import { type Result, Ok, Err } from "lrustlike/result";

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
import { type Option, Some, None } from "lrustlike/option";

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
