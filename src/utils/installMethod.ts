const getPrototypeName = (prototype: object) =>
  typeof prototype.constructor === "function"
      ? `${prototype.constructor.name}.prototype`
      : "unknown prototype";

export function installMethod(name: string, fn: Function, ...prototypes: object[]) {
  const failedPrototypes = new Array()

  for (const prototype of prototypes) {
    if (!Object.isExtensible(prototype)) {
      failedPrototypes.push(getPrototypeName(prototype))
    }
  }

  if (failedPrototypes.length !== 0) {
    throw new Error(`The following prototypes are not extensible: ${failedPrototypes.join(", ")}`)
  }

  for (const prototype of prototypes) {
    if (Object.prototype.hasOwnProperty.call(prototype, name)) {
      failedPrototypes.push(getPrototypeName(prototype))
    }
  }

  if (failedPrototypes.length !== 0) {
    throw new Error(`The following prototypes have already defined ${name as string}: ${failedPrototypes.join(", ")}`)
  }

  for (const prototype of prototypes) {
    Object.defineProperty(prototype, name, {
        value: fn,
        enumerable: false,
        configurable: true,
        writable: false,
      });
  }
}
