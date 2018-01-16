import { AsyncScheduler } from './AsyncScheduler'
export class AsapScheduler extends AsyncScheduler {
  flush (action) {
    this.active = true
    this.scheduled = undefined
    const actions = this.actions
    let error
    action = action || actions.shift()
    do {
      if ((error = action.execute(action.state, action.delay))) break
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
