import { mergeMapOperator } from './mergeMap'

export const mergeAll = function (concurrent) {
  return this.lift(mergeMapOperator(undefined, undefined, concurrent))
}
