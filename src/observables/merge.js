import { isScheduler, isNumber } from '../utils'
import { Observable } from '../Observable'
import { mergeMapOperator as mergeMap } from '../operators/mergeMap'
import { ArrayObservable } from './ArrayObservable'
export const merge = function (...observables) {
  let scheduler = observables[observables.length - 1]
  if (isScheduler(scheduler)) {
    observables.pop()
  } else {
    scheduler = null
  }

  let concurrent = observables[observables.length - 1]
  if (isNumber(concurrent)) {
    observables.pop()
  } else {
    concurrent = Number.POSITIVE_INFINITY
  }

  if (
    scheduler === null &&
    observables.length === 1 &&
    observables[0] instanceof Observable
  ) {
    return observables[0]
  }

  return new ArrayObservable(observables, scheduler).lift(
    mergeMap(undefined, undefined, concurrent)
  )
}
