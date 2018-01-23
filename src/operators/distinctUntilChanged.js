import { isFunction } from '../utils'
export function distinctUntilChangedOperator (compare, keySelector) {
  const selectable = isFunction(keySelector)
  compare = isFunction(compare) ? compare : (a, b) => a === b
  return observer => {
    let emited = false
    let key
    let prevKey
    return function (value) {
      try {
        if (selectable) {
          key = keySelector(value)
        } else {
          key = value
        }

        if (!emited || Boolean(compare(prevKey, key)) === false) {
          observer.next(value)
        }

        emited = true
        prevKey = key
      } catch (e) {
        observer.error(e)
      }
    }
  }
}
