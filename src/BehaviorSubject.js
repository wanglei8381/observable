import { Subject } from './Subject'
import { ObjectUnsubscribedError } from './utils'
export class BehaviorSubject extends Subject {
  constructor (val) {
    super()
    this._value = val
  }

  next (val) {
    this._value = val
    super.next(val)
  }

  _subscribe (observer) {
    const res = super._subscribe(observer)
    if (!observer.closed) {
      observer.next(this._value)
    }
    return res
  }

  getValue () {
    if (this.hasError) {
      throw this.thrownError
    } else if (this.closed) {
      throw new ObjectUnsubscribedError()
    } else {
      return this._value
    }
  }

  get value () {
    return this.getValue()
  }
}
