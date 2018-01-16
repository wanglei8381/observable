import { Observable } from '../Observable'
export class EmptyObservable extends Observable {
  constructor (scheduler) {
    super()
    this.scheduler = scheduler
  }

  _subscribe (observer) {
    const scheduler = this.scheduler

    if (scheduler) {
      return scheduler.schedule(EmptyObservable.dispatch, 0, { observer })
    } else {
      observer.complete()
    }
  }

  static create (scheduler) {
    return new EmptyObservable(scheduler)
  }

  static dispatch ({ observer }) {
    observer.complete()
  }
}
