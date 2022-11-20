export function checkType(prop, name, type) {
  if (typeof prop !== 'object') {
    throw new TypeError(`Property '${name}' is ${typeof prop}`);
  }
  if (prop.type !== type) {
    throw new TypeError(`Property ${name} should be a ${type}.`)
  }
  return prop;
}
