import { isFunction } from './utils'
export class Subscription {
  constructor () {
    this._closed = false
    this.observers = []
  }

  unsubscribe () {
    if (this._unsubscribe) {
      this._unsubscribe()
    }
    this.observers.forEach(observer => {
      observer.unsubscribe()
    })
    this.observers = []
    this._closed = true
  }

  add (observer) {
    if (isFunction(observer)) {
      this.observers.push({
        unsubscribe: observer
      })
    } else if (observer instanceof Subscription) {
      this.observers.push(observer)
    }
  }

  get closed () {
    return this._closed
  }
}
