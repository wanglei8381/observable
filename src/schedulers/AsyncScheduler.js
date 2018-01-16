import { Scheduler } from '../Scheduler'
export class AsyncScheduler extends Scheduler {
  actions = []
  active = false
  scheduled = undefined

  flush (action) {
    const { actions } = this
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