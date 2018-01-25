import { Observable } from '../../Observable'
import { ArrayObservable } from '../../observables/ArrayObservable'
Observable.range = function (start, end, scheduler) {
  const arr = []
  for (let i = start; i <= end; i++) {
    arr.push(i)
  }
  return new ArrayObservable(arr, scheduler)
}
