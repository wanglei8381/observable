import { Action } from './Action'

export class AsyncAction extends Action {
  id = null
  state = undefined
  delay = 0
  pending = false

  schedule (state, delay = 0) {
    if (this.closed) return this

    this.state = state
    this.delay = delay
    this.pending = true
    let { scheduler, id } = this
    if (id != null) {
      id = this.recycleAsyncId(scheduler, id, delay)
    }
    if (!id) {
      id = this.requestAsyncId(scheduler, id, delay)
    }
    this.id = id
    return this
  }

  recycleAsyncId (scheduler, id, delay) {
    if (delay !== null && this.delay === delay && this.pending === false) {
      return id
    }
    clearInterval(id)
    return undefined
  }

  requestAsyncId (scheduler, id, delay) {
    return setInterval(scheduler.flush.bind(scheduler, this), delay)
  }

  execute (state) {
    if (this.closed) {
      return new Error('executing a cancelled action')
    }
    this.pending = false
    const error = this._execute(state)
    if (error) {
      return error
    } else if (this.pending === false && this.id != null) {
      this.id = this.recycleAsyncId(this.scheduler, this.id, null)
    }
  }

  _execute (state) {
    try {
      this.work(state)
    } catch (e) {
      this.unsubscribe()
      return e
    }
  }

  _unsubscribe () {
    const id = this.id
    const scheduler = this.scheduler
    const actions = scheduler.actions
    const index = actions.indexOf(this)

    this.work = null
    this.state = null
    this.pending = false
    this.scheduler = null

    if (index !== -1) {
      actions.splice(index, 1)
    }

    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, null)
    }

    this.delay = null
  }
}
