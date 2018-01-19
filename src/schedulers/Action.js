import { Subscription } from '../Subscription'

let uid = 0
export class Action extends Subscription {
  constructor (scheduler, work) {
    super()
    this.scheduler = scheduler
    this.work = work
    this._uid = uid++
  }

  // 该方法需要在子类中重写
  schedule (state, delay) {
    return this
  }
}
