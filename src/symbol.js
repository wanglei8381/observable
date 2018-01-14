export function getSymbolObservable () {
  let $$observable

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      $$observable = Symbol.observable
    } else {
      $$observable = Symbol('observable')
      Symbol.observable = $$observable
    }
  } else {
    $$observable = '@@observable'
  }

  return $$observable
}

export const observable = getSymbolObservable()
