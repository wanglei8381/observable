import { Observable } from '../Observable'
import { SubscriptionLoggable } from './SubscriptionLoggable'
import { applyMixins } from '../utils'
export class ColdObservable extends Observable {
  constructor (messages, scheduler) {
    super(subscriber => {
      const index = this.logSubscribedFrame()
      subscriber.add(() => {
        this.logUnsubscribedFrame(index)
      })
      this.scheduleMessages(subscriber)
      return subscriber
    })
    this.messages = messages
    this.scheduler = scheduler
    this.subscriptions = []
  }

  scheduleMessages (subscriber) {
    const messagesLength = this.messages.length
    for (let i = 0; i < messagesLength; i++) {
      const message = this.messages[i]
      subscriber.add(
        this.scheduler.schedule(
          ({ message, subscriber }) => {
            message.notification.observe(subscriber)
          },
          message.frame,
          { message, subscriber }
        )
      )
    }
  }
}

applyMixins(ColdObservable, [SubscriptionLoggable])
