export function getSymbolObservable (key) {
  let $$observable

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      $$observable = Symbol.observable
    } else {
      $$observable = Symbol(key)
      Symbol.observable = $$observable
    }
  } else {
    $$observable = '@@' + key
  }

  return $$observable
}

export function symbolIteratorPonyfill () {
  if (typeof Symbol === 'function') {
    if (!Symbol.iterator) {
      Symbol.iterator = Symbol('iterator polyfill')
    }
    return Symbol.iterator
  } else {
    // [for Mozilla Gecko 27-35:](https://mzl.la/2ewE1zC)
    if (
      typeof Set !== 'undefined' &&
      typeof new Set()['@@iterator'] === 'function'
    ) {
      return '@@iterator'
    }
    // required for compatability with es6-shim
    if (typeof Map !== 'undefined') {
      let keys = Object.getOwnPropertyNames(Map.prototype)
      for (let i = 0; i < keys.length; ++i) {
        let key = keys[i]
        // according to spec, Map.prototype[@@iterator] and Map.orototype.entries must be equal.
        if (
          key !== 'entries' &&
          key !== 'size' &&
          Map.prototype[key] === Map.prototype['entries']
        ) {
          return key
        }
      }
    }
    return '@@iterator'
  }
}

export const iterator = symbolIteratorPonyfill()

export const observable = getSymbolObservable('observable')

export const rxSubscriber = getSymbolObservable('rxSubscriber')
