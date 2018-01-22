import { SubscriptionLog } from './SubscriptionLog'
// 这个类没有直接使用，通过混合的方式提供给HotObservable和ColdObservable
export class SubscriptionLoggable {
  subscriptions = []
  scheduler = null

  logSubscribedFrame () {
    this.subscriptions.push(new SubscriptionLog(this.scheduler.now()))
    return this.subscriptions.length - 1
  }

  logUnsubscribedFrame (index) {
    const subscriptionLogs = this.subscriptions
    const oldSubscriptionLog = subscriptionLogs[index]
    subscriptionLogs[index] = new SubscriptionLog(
      oldSubscriptionLog.subscribedFrame,
      this.scheduler.now()
    )
  }
}
