import { Observable } from '../Observable'
export class ScalarObservable extends Observable {
  constructor (value, scheduler) {
    super()
    this.value = value
    this.scheduler = scheduler
  }

  _subscribe (observer) {
    const { value, scheduler } = this
    if (scheduler) {
      scheduler.schedule(ScalarObservable.dispatch, {
        observer,
        value
      })
    } else {
      observer.next(value)
      observer.complete()
    }
  }

  static create (array, scheduler) {
    return new ScalarObservable(array, scheduler)
  }

  static dispatch (state) {
    const { observer, value } = state
    observer.next(value)
    observer.complete()
  }
}
