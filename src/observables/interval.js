import { TimerObservable } from './TimerObservable'

export const interval = (period, scheduler) => {
  period = period < 0 ? 0 : period
  return TimerObservable.create(period, period, scheduler)
}
