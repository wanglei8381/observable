import { isNil, isFunction, isObjectLike } from './utils'
import { Subscription } from './Subscription'
import { rxSubscriber as rxSubscriberSymbol } from './symbol'
export class Subscriber extends Subscription {
  constructor (destinationOrNext, error, complete) {
    super()
    if (isObjectLike(destinationOrNext)) {
      this.destination = destinationOrNext
    } else {
      this.destination = {
        next: destinationOrNext && destinationOrNext.bind(this),
        error: error && error.bind(this),
        complete: complete && complete.bind(this)
      }
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

  _next (value) {
    if (this.destination.next) {
      this.destination.next(value)
    }
  }

  _error (e) {
    if (this.destination.error) {
      this.destination.error(e)
    }
  }

  _complete () {
    if (this.destination.complete) {
      this.destination.complete()
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
  if (observerOrNext[rxSubscriberSymbol]) {
    next = observerOrNext[rxSubscriberSymbol]()
  }
  return new Subscriber(next, error, complete)
}
