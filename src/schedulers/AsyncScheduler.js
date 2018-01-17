import { Scheduler } from '../Scheduler'
export class AsyncScheduler extends Scheduler {
  actions = []
  active = false
  scheduled = undefined

  flush (action) {
    const { actions } = this
    // 在schedule中继续调用schedule，如果schedule是同步的，只需要添加队列中等待执行即可
    if (this.active) {
      actions.push(action)
      return
    }
    this.active = true
    let error
    do {
      if ((error = action.execute(action.state, action.delay))) {
        break
      }
    } while ((action = actions.shift()))
    this.active = false
    if (error) {
      while ((action = actions.shift())) {
        action.unsubscribe()
      }
      throw error
    }
  }
}
