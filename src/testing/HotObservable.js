import { Subject } from '../Subject'
import { SubscriptionLoggable } from './SubscriptionLoggable'
import { applyMixins } from '../utils'

export class HotObservable extends Subject {
  constructor (messages, scheduler) {
    super()
    this.messages = messages
    this.scheduler = scheduler
    this.subscriptions = []
  }

  _subscribe (subscriber) {
    const index = this.logSubscribedFrame()
    subscriber.add(() => {
      this.logUnsubscribedFrame(index)
    })
    return super._subscribe(subscriber)
  }

  // TestScheduler的flush中调用
  setup () {
    this.messages.forEach(message => {
      this.scheduler.schedule(() => {
        message.notification.observe(this)
      }, message.frame)
    })
  }
}

applyMixins(HotObservable, [SubscriptionLoggable])
