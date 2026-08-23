import { installMethod } from "../../utils/installMethod.js";
import { findOption } from "./iterable.js"

export function installIterableMethods() {
  installFindOptionMethod()
}

export function installFindOptionMethod() {
  installMethod(
    "findOption",
    findOption,
    Array.prototype,
    Set.prototype,
    Map.prototype,
  );
}
