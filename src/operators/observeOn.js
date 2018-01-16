import { Subscriber } from '../Subscriber'
import { Notification } from '../Notification'
export class ObserveOnSubscriber extends Subscriber {
  constructor (destination, scheduler, delay = 0) {
    super(destination)
    this.scheduler = scheduler
    this.delay = delay
  }

  static dispatch ({ notification, destination }) {
    notification.observe(destination)
    // this: scheduler执行中的action
    this.unsubscribe()
  }

  scheduleMessage (notification) {
    this.add(
      this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, {
        notification,
        destination: this.destination
      })
    )
  }

  _next (value) {
    this.scheduleMessage(Notification.createNext(value))
  }

  _error (e) {
    this.scheduleMessage(Notification.createError(e))
  }

  _complete () {
    this.scheduleMessage(Notification.createComplete())
  }
}
