import { concat as concatObservable } from '../observables/concat'

export const concat = function (...observables) {
  observables.unshift(this)
  return concatObservable(...observables)
}
