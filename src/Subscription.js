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
    // _closed要在循环之前赋值，避免相互引用导致的死循环
    this._closed = true
    this.observers.forEach(observer => {
      if (observer.closed !== true) {
        observer.unsubscribe()
      }
    })

    this.observers = []
  }

  add (observer) {
    // 在asObservable中会把自己加进来，要进行排除，不然在unsubscribe会造成死循环(bug：找了好久)
    if (observer === this) return this
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
