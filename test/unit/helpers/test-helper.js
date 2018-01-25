import { observable as $$symbolObservable } from '../../../src/symbol'
export function lowerCaseO (...args) {
  const o = {
    subscribe: function (observer) {
      args.forEach(function (v) {
        observer.next(v)
      })
      observer.complete()
    }
  }

  o[$$symbolObservable] = function () {
    return this
  }

  return o
}
