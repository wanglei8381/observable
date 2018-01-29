import { Subscriber } from '../Subscriber'
import { async } from '../schedulers/async'

export function debounceTimeOperator (dueTime, scheduler = async) {
  return observer => new DebounceTimeSubscriber(observer, dueTime, scheduler)
}

class DebounceTimeSubscriber extends Subscriber {
  debouncedSubscription = null
  lastValue = null
  hasValue = false

  constructor (destination, dueTime, scheduler) {
    super(destination)
    this.dueTime = dueTime
    this.scheduler = scheduler
  }

  _next (value) {
    this.clearDebounce()
    this.lastValue = value
    this.hasValue = true
    this.debouncedSubscription = this.scheduler.schedule(() => {
      this.debouncedNext()
    }, this.dueTime)
    this.add(this.debouncedSubscription)
  }

  _complete () {
    this.debouncedNext()
    super._complete()
  }

  debouncedNext () {
    this.clearDebounce()
    if (this.hasValue) {
      const { lastValue } = this
      // This must be done *before* passing the value
      // along to the destination because it's possible for
      // the value to synchronously re-enter this operator
      // recursively when scheduled with things like
      // VirtualScheduler/TestScheduler.
      this.lastValue = null
      this.hasValue = false
      this.destination.next(lastValue)
    }
  }

  clearDebounce () {
    const debouncedSubscription = this.debouncedSubscription

    if (debouncedSubscription !== null) {
      this.remove(debouncedSubscription)
      debouncedSubscription.unsubscribe()
      this.debouncedSubscription = null
    }
  }
}
