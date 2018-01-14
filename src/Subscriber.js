import {
  isNil,
  isFunction,
  isObjectLike
} from './utils'
import { Subscription } from './Subscription'
export class Subscriber extends Subscription {
  constructor (next, error, complete) {
    super()
    if (next) {
      this._next = next
    }
    if (error) {
      this._error = error
    }
    if (complete) {
      this._complete = complete
    }

    this.active = true
  }

  next (val) {
    if (!this.active) return
    if (this._next) {
      try {
        this._next(val)
      } catch (e) {
        this.unsubscribe()
        this.errorSource = 'next'
        this.errorValue = e
      }
    }
  }

  error (e) {
    if (!this.active) return
    if (this._error) {
      try {
        this._error(e)
      } catch (e) {
        this.unsubscribe()
        this.errorSource = 'error'
        throw e
      }
    } else {
      this.unsubscribe()
      this.errorSource = 'error'
      throw e
    }
    this.unsubscribe()
  }

  complete () {
    if (!this.active) return
    if (this._complete) {
      this._complete()
    }
    this.unsubscribe()
  }

  add (observer) {
    if (!this.active) {
      if (isFunction(observer)) {
        observer()
      } else if (observer instanceof Subscription) {
        observer.unsubscribe()
      }
    } else {
      super.add(observer)
    }
  }

  _unsubscribe () {
    this.active = false
  }
}

export const emptySubscriber = new Subscriber()

export function toSubscriber (observerOrNext, error, complete) {
  let next = observerOrNext
  if (isNil(observerOrNext)) return emptySubscriber
  if (observerOrNext instanceof Subscriber) return observerOrNext
  if (isObjectLike(observerOrNext)) {
    next = observerOrNext.next
    error = observerOrNext.error
    complete = observerOrNext.complete
  }
  return new Subscriber(next, error, complete)
}
