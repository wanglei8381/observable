import { Subscription } from '../Subscription'

export class Action extends Subscription {
  constructor (scheduler, work) {
    super()
    this.scheduler = scheduler
    this.work = work
  }

  // 该方法需要在子类中重写
  schedule (state, delay) {
    return this
  }
}