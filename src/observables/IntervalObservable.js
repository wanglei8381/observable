import { Observable } from '../Observable'
import { async } from '../schedulers/async'
export class IntervalObservable extends Observable {
  constructor (period = 0, scheduler = async) {
    super()
    this.period = period
    this.scheduler = scheduler
  }

  _subscribe (observer) {
    const { scheduler, period } = this
    scheduler.schedule(IntervalObservable.dispatch, period, {
      value: 0,
      period
    })
  }

  static dispatch (state) {
    const { value, period } = state
    this.schedule(value + 1, period)
  }
}
