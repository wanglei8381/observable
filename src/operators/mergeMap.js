import { OuterSubscriber } from '../OuterSubscriber'
import { isNumber } from '../utils'
import { subscribeToResult } from '../utils/subscribeToResult'

export function mergeMapOperator (
  project,
  resultSelector,
  concurrent = Number.POSITIVE_INFINITY
) {
  if (isNumber(resultSelector)) {
    concurrent = resultSelector
    resultSelector = null
  }
  return observer =>
    new MergeMapSubscriber(observer, project, resultSelector, concurrent)
}

class MergeMapSubscriber extends OuterSubscriber {
  constructor (destination, project, resultSelector, concurrent) {
    super(destination)
    this.project = project
    this.resultSelector = resultSelector
    this.concurrent = concurrent
    this.index = 0
    this.hasCompleted = false
    this.buffer = []
    this.active = 0
  }

  _next (value) {
    if (this.active < this.concurrent) {
      this._tryNext(value)
    } else {
      this.buffer.push(value)
    }
  }

  _tryNext (value) {
    try {
      const index = this.index++
      const result = this.project(value, index)
      this.active++
      this._innerSub(result, value, index)
    } catch (e) {
      super._error(e)
    }
  }

  _innerSub (ish, value, index) {
    this.add(subscribeToResult(this, ish, value, index))
  }

  _complete () {
    this.hasCompleted = true
    // 所有的都结束了
    if (this.active === 0 && this.buffer.length === 0) {
      this.destination.complete()
    }
  }

  notifyNext (outerValue, innerValue, outerIndex, innerIndex) {
    if (this.resultSelector) {
      this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex)
    } else {
      this.destination.next(innerValue)
    }
  }

  _notifyResultSelector (outerValue, innerValue, outerIndex, innerIndex) {
    try {
      const result = this.resultSelector(
        outerValue,
        innerValue,
        outerIndex,
        innerIndex
      )
      this.destination.next(result)
    } catch (err) {
      this.destination.error(err)
    }
  }

  notifyComplete (innerSub) {
    const buffer = this.buffer
    this.remove(innerSub)
    this.active--
    if (buffer.length > 0) {
      this._next(buffer.shift())
    } else if (this.active === 0 && this.hasCompleted) {
      this.destination.complete()
    }
  }
}
