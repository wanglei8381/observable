import { Observable } from '../Observable'
export class ErrorObservable extends Observable {
  constructor (error, scheduler) {
    super()
    this.error = error
    this.scheduler = scheduler
  }

  _subscribe (observer) {
    const scheduler = this.scheduler
    const error = this.error
    if (scheduler) {
      return scheduler.schedule(ErrorObservable.dispatch, 0, {
        observer,
        error
      })
    } else {
      observer.error(error)
    }
  }

  static create (scheduler) {
    return new ErrorObservable(scheduler)
  }

  static dispatch ({ observer, error }) {
    observer.error(error)
  }
}
