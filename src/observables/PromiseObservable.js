import { Observable } from '../Observable'

export class PromiseObservable extends Observable {
  constructor (promise, scheduler) {
    super()
    this.promise = promise
    this.scheduler = scheduler
  }

  _subscribe (observer) {
    const { promise, scheduler } = this
    if (scheduler) {
      if (this._isScalar) {
        scheduler.schedule(PromiseObservable.dispatch, 0, {
          observer,
          value: this.value
        })
      } else {
        promise
          .then(
            value => {
              this._isScalar = true
              this.value = value
              scheduler.schedule(PromiseObservable.dispatch, 0, {
                observer,
                value
              })
            },
            error => {
              scheduler.schedule(
                ({ observer, error }) => {
                  observer.error(error)
                },
                0,
                { observer, error }
              )
            }
          )
          .catch(e => {
            // escape the promise trap, throw unhandled errors
            setTimeout(() => {
              throw e
            })
          })
      }
    } else {
      // 已经执行过
      if (this._isScalar) {
        observer.next(this.value)
        observer.complete()
      } else {
        promise
          .then(
            value => {
              this._isScalar = true
              this.value = value
              observer.next(value)
              observer.complete()
            },
            e => {
              observer.error(e)
            }
          )
          .catch(e => {
            // escape the promise trap, throw unhandled errors
            setTimeout(() => {
              throw e
            })
          })
      }
    }
  }

  static create (promise, scheduler) {
    return new PromiseObservable(promise, scheduler)
  }

  static dispatch ({ observer, value }) {
    observer.next(value)
    observer.complete()
  }
}
