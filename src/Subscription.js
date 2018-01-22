import { isFunction, _Set } from './utils'

let uid = 0
export class Subscription {
  constructor () {
    this._closed = false
    this._uid = uid++
    this._set = new _Set()
    this.observers = []
  }

  unsubscribe () {
    if (this.closed) return
    if (this._unsubscribe) {
      this._unsubscribe()
    }
    // _closed要在循环之前赋值，避免相互引用导致的死循环
    this._closed = true
    const observers = this.observers
    for (let i = 0; i < observers.length; i++) {
      const observer = observers[i]
      if (observer.closed !== true) {
        observer.unsubscribe()
      }
    }

    this._set.clear()
    this.observers = []
  }

  add (observer) {
    // 在asObservable中会把自己加进来，要进行排除，不然在unsubscribe会造成死循环(bug：找了好久)
    if (observer === this) return this

    if (isFunction(observer)) {
      this._add({
        _uid: uid++,
        unsubscribe: observer
      })
    } else if (observer instanceof Subscription) {
      this._add(observer)
    }
  }

  _add (observer) {
    const { _set, observers } = this
    if (!_set.has(observer._uid)) {
      _set.add(uid)
      observers.push(observer)
    }
  }

  remove (observer) {
    const { _set, observers } = this
    if (observer && observer._uid && _set.has(observer._uid)) {
      observers.splice(observers.indexOf(observer), 1)
    }
  }

  get closed () {
    return this._closed
  }
}
