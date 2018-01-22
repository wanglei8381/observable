import { ArgumentOutOfRangeError } from '../utils'
export function takeOperator (number = Number.POSITIVE_INFINITY) {
  if (number < 0) {
    throw new ArgumentOutOfRangeError()
  }
  return observer => {
    let count = 0
    if (number === 0) {
      return observer.complete()
    }
    return function (val) {
      count++
      if (count > number) {
        observer.complete()
      } else {
        observer.next(val)
        if (count === number) {
          observer.complete()
        }
      }
    }
  }
}
