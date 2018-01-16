import { isObjectLike, isUndefined } from './utils'
import { Observable } from './Observable'
export class Notification {
  constructor (kind, value, error) {
    this.kind = kind
    this.value = value
    this.error = error
    this.hasValue = kind === 'N'
  }

  observe (observer) {
    switch (this.kind) {
      case 'N':
        return observer.next && observer.next(this.value)
      case 'E':
        return observer.error && observer.error(this.error)
      case 'C':
        return observer.complete && observer.complete()
    }
  }

  do (next, error, complete) {
    this.observe({
      next,
      error,
      complete
    })
  }

  accept (nextOrObserver, error, complete) {
    if (isObjectLike(nextOrObserver)) {
      this.observe(nextOrObserver)
    } else {
      this.do(nextOrObserver, error, complete)
    }
  }

  toObservable () {
    const kind = this.kind
    switch (kind) {
      case 'N':
        return Observable.of(this.value)
      case 'E':
        return Observable.throw(this.error)
      case 'C':
        return Observable.empty()
    }
    throw new Error('unexpected notification kind value')
  }

  static completeNotification = new Notification('C')
  static undefinedValueNotification = new Notification('N', undefined)

  static createNext (value) {
    return isUndefined(value)
      ? Notification.undefinedValueNotification
      : new Notification('N', value)
  }

  static createError (e) {
    return new Notification('E', undefined, e)
  }

  static createComplete () {
    return Notification.completeNotification
  }
}
