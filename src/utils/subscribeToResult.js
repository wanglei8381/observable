import {
  iterator as SymbolIterator,
  observable as SymbolObservable
} from '../symbol'
import { isObject, isArrayLike, isPromise } from './type'
import { Observable } from '../Observable'
import { InnerSubscriber } from '../InnerSubscriber'
export function subscribeToResult (
  outerSubscriber,
  result,
  outerValue,
  outerIndex
) {
  const destination = new InnerSubscriber(
    outerSubscriber,
    outerValue,
    outerIndex
  )
  if (destination.closed) return null
  if (result instanceof Observable) {
    if (result._isScalar) {
      destination.next(result.value)
      destination.complete()
      return null
    } else {
      return result.subscribe(destination)
    }
  } else if (isArrayLike(result)) {
    for (let i = 0, len = result.length; i < len && !destination.closed; i++) {
      destination.next(result[i])
    }
    if (!destination.closed) {
      destination.complete()
    }
  } else if (isPromise(result)) {
    result
      .then(
        value => {
          if (!destination.closed) {
            destination.next(value)
            destination.complete()
          }
        },
        err => destination.error(err)
      )
      .catch(err => {
        setTimeout(() => {
          throw err
        })
      })
    return destination
  } else if (result && typeof result[SymbolIterator] === 'function') {
    const iterator = result[SymbolIterator]()
    do {
      let item = iterator.next()
      if (item.done) {
        destination.complete()
        break
      }
      destination.next(item.value)
      if (destination.closed) {
        break
      }
    } while (true)
  } else if (result && typeof result[SymbolObservable] === 'function') {
    const obs = result[SymbolObservable]()
    if (typeof obs.subscribe !== 'function') {
      destination.error(
        new TypeError(
          'Provided object does not correctly implement Symbol.observable'
        )
      )
    } else {
      return obs.subscribe(
        new InnerSubscriber(outerSubscriber, outerValue, outerIndex)
      )
    }
  } else {
    const value = isObject(result) ? 'an invalid object' : `'${result}'`
    const msg =
      `You provided ${value} where a stream was expected.` +
      ' You can provide an Observable, Promise, Array, or Iterable.'
    destination.error(new TypeError(msg))
  }
  return null
}
