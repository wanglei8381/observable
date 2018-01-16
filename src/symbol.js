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

export const observable = getSymbolObservable('observable')

export const rxSubscriber = getSymbolObservable('rxSubscriber')
