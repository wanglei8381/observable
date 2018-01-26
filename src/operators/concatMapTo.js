import { concatMap } from './concatMap'
export const concatMapTo = function (innerObservable, resultSelector) {
  return concatMap(() => innerObservable, resultSelector)
}
