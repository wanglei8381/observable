import { Observable } from '../Observable'
import { iterator as SymbolIterator } from '../symbol'
export class IteratorObservable extends Observable {
  constructor (iteratorObject, scheduler) {
    super()
    if (iteratorObject == null) {
      throw new Error('iterator cannot be null.')
    } else if (!iteratorObject[SymbolIterator]) {
      throw new TypeError('object is not iterable')
    }
    this.iteratorObject = iteratorObject
    this.scheduler = scheduler
  }

  _subscribe (observer) {
    const { iteratorObject, scheduler } = this
    const iterator = getIterator(iteratorObject)
    if (scheduler) {
      return scheduler.schedule(IteratorObservable.dispatch, 0, {
        observer,
        iterator,
        index: 0
      })
    } else {
      do {
        const res = iterator.next()
        if (res.done) {
          observer.complete()
          break
        } else {
          observer.next(res.value)
        }
        // 不理解
        if (observer.closed) {
          if (typeof iterator.return === 'function') {
            iterator.return()
          }
          break
        }
      } while (true)
    }
  }

  static create (iterator, scheduler) {
    return new IteratorObservable(iterator, scheduler)
  }

  static dispatch (state) {
    const { observer, iterator, index } = state
    // if (hasError) {
    //   observer.error(error)
    //   return
    // }

    const result = iterator.next()
    if (result.done) {
      observer.complete()
      return
    }

    observer.next(result.value)
    state.index = index + 1

    if (observer.closed) {
      if (typeof iterator.return === 'function') {
        iterator.return()
      }
      return
    }

    this.schedule(state)
  }
}

class StringIterator {
  constructor (str, idx = 0, len = str.length) {
    this.str = str
    this.idx = idx
    this.len = len
  }

  next () {
    return this.idx < this.len
      ? { done: false, value: this.str.charAt(this.idx++) }
      : { done: true, value: undefined }
  }

  [SymbolIterator] () {
    return this
  }
}

class ArrayIterator {
  constructor (array, idx = 0, len = array.length) {
    this.array = array
    this.idx = idx
    this.len = len
  }

  next () {
    return this.idx < this.len
      ? { done: false, value: this.array[this.idx++] }
      : { done: true, value: undefined }
  }

  [SymbolIterator] () {
    return this
  }
}

function getIterator (obj) {
  const i = obj[SymbolIterator]
  if (!i && typeof obj === 'string') {
    return new StringIterator(obj)
  }
  if (!i && obj.length !== undefined) {
    return new ArrayIterator(obj)
  }
  if (!i) {
    throw new TypeError('object is not iterable')
  }
  return obj[SymbolIterator]()
}
