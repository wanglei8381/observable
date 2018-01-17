import { AsyncScheduler } from './AsyncScheduler'
import { AsyncAction } from './AsyncAction'
export class VirtualTimeScheduler extends AsyncScheduler {
  static frameTimeFactor = 10
  constructor (SchedulerAction, maxFrames) {
    super(SchedulerAction, () => this.frame)
    this.frame = 0
    this.index = -1
    this.maxFrames = maxFrames
  }

  flush () {
    const { maxFrames, actions } = this
    let error
    let action
    while (
      (action = actions.shift()) &&
      (this.frame = action.delay) < maxFrames
    ) {
      if ((error = action.execute(action.state, action.delay))) {
        break
      }
    }
    if (error) {
      while ((action = actions.shift())) {
        action.unsubscribe()
      }
      throw error
    }
  }
}

export class VirtualAction extends AsyncAction {
  constructor (scheduler, work, index = (scheduler.index += 1)) {
    super(scheduler, work)
    this.index = scheduler.index = index
    this.active = true
  }

  schedule (state, delay) {
    if (!this.id) {
      return super.schedule(state, delay)
    }
    this.active = false
    const action = new VirtualAction(this.scheduler, this.work)
    this.add(action)
    return action.schedule(state, delay)
  }

  requestAsyncId (scheduler, id, delay = 0) {
    this.delay = scheduler.frame + delay
    const { actions } = scheduler
    actions.push(this)
    actions.sort(VirtualAction.sortActions)
    return true
  }

  recycleAsyncId () {
    return undefined
  }

  _execute (state, delay) {
    if (this.active === true) {
      return super._execute(state, delay)
    }
  }

  static sortActions (a, b) {
    if (a.delay === b.delay) {
      if (a.index === b.index) {
        return 0
      } else if (a.index > b.index) {
        return 1
      } else {
        return -1
      }
    } else if (a.delay > b.delay) {
      return 1
    } else {
      return -1
    }
  }
}
