import { Observable } from '../Observable'
import { async } from '../schedulers/async'
import { isNumber, isScheduler, isDate } from '../utils'

export class TimerObservable extends Observable {
  constructor (dueTime = 0, period, scheduler) {
    super()

    this.period = -1
    if (isNumber(period)) {
      this.period = period
    } else if (isScheduler(period)) {
      scheduler = period
    }

    this.scheduler = isScheduler(scheduler) ? scheduler : async

    this.dueTime = isDate(dueTime) ? +dueTime - scheduler.now() : dueTime
  }

  _subscribe (observer) {
    return this.scheduler.schedule(TimerObservable.dispatch, this.dueTime, {
      index: 0,
      observer,
      period: this.period
    })
  }

  static dispatch (state) {
    const { observer, period, index } = state
    observer.next(index)
    if (observer.closed) return
    if (period === -1) return observer.complete()
    state.index = index + 1
    this.schedule(state, period)
  }

  static create (initialDelay, period, scheduler) {
    return new TimerObservable(initialDelay, period, scheduler)
  }
}
