import { merge } from '../observables/merge'
import { fromObservable } from './from'
import { isScheduler } from '../utils'

export const concat = function (...observables) {
  const length = observables.length
  if (length === 1) {
    return fromObservable(observables[0])
  }

  if (isScheduler(observables[length - 1])) {
    observables.splice(length - 1, 0, 1)
  } else {
    observables.push(1)
  }

  return merge(...observables)
}
