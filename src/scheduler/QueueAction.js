import { AsyncAction } from './AsyncAction'

export class QueueAction extends AsyncAction {
  schedule (state, delay = 0) {
    if (this.closed) return this
    if (delay > 0) {
      return super.schedule(state, delay)
    }

    this.state = state
    this.delay = delay
    this.scheduler.flush(this)
    return this
  }

  requestAsyncId (scheduler, id, delay) {
    if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
      return super.requestAsyncId(scheduler, id, delay)
    }
    return scheduler.flush(this)
  }
}
