/**
 * @module helpers
 */
type Constructor<T> = new (...args: any) => T;
export default function applyMixins(
  derivcedCtor: Constructor<any>,
  baseCtors: Constructor<any>[]
) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivcedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      );
    });
  });
}
