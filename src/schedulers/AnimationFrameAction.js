import { requestAnimationFrame, cancelAnimationFrame } from '../utils'
import { AsyncAction } from './AsyncAction'
export class AnimationFrameAction extends AsyncAction {
  requestAsyncId (scheduler, id, delay = 0) {
    if (delay != null && delay > 0) {
      return super.requestAsyncId(scheduler, id, delay)
    }
    scheduler.actions.push(this)
    return (
      scheduler.scheduled ||
      (scheduler.scheduled = requestAnimationFrame(
        scheduler.flush.bind(scheduler, null)
      ))
    )
  }

  recycleAsyncId (scheduler, id, delay = 0) {
    if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
      return super.recycleAsyncId(scheduler, id, delay)
    }

    if (scheduler.actions.length === 0) {
      cancelAnimationFrame(id)
      scheduler.scheduled = undefined
    }

    return undefined
  }
}
