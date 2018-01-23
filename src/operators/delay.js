import { Scheduler } from '../schedulers'
import { Subscriber } from '../Subscriber'
import { Notification } from '../Notification'
import { isDate } from '../utils'
export function delayOperator (delay = 0, scheduler = Scheduler.async) {
  const absoluteDelay = isDate(delay)
  const delayFor = absoluteDelay ? +delay - scheduler.now() : Math.abs(delay)
  return observer => new DelaySubscriber(observer, delayFor, scheduler)
}

class DelaySubscriber extends Subscriber {
  constructor (destination, delay, scheduler) {
    super(destination)
    this.delay = delay
    this.scheduler = scheduler
    this.queue = []
    this.active = false
    this.errored = false
  }

  _schedule (scheduler) {
    this.active = true
    this.add(
      scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
        source: this,
        destination: this.destination,
        scheduler
      })
    )
  }

  scheduleNotification (notification) {
    if (this.errored === true) {
      return
    }

    const scheduler = this.scheduler
    const message = {
      time: scheduler.now() + this.delay,
      notification
    }
    this.queue.push(message)

    if (this.active === false) {
      this._schedule(scheduler)
    }
  }

  _next (value) {
    this.scheduleNotification(Notification.createNext(value))
  }

  _error (err) {
    this.errored = true
    this.queue = []
    this.destination.error(err)
  }

  _complete () {
    this.scheduleNotification(Notification.createComplete())
  }

  static dispatch (state) {
    const source = state.source
    const queue = source.queue
    const scheduler = state.scheduler
    const destination = state.destination

    while (queue.length > 0 && queue[0].time - scheduler.now() <= 0) {
      queue.shift().notification.observe(destination)
    }

    if (queue.length > 0) {
      const delay = Math.max(0, queue[0].time - scheduler.now())
      this.schedule(state, delay)
    } else {
      source.active = false
    }
  }
}
