import { OuterSubscriber } from '../OuterSubscriber'
import { isNumber } from '../utils'
import { subscribeToResult } from '../utils/subscribeToResult'

/**
 * 由当前流触发多个流按时间穿插合并到一起
 * 具体用途：
 * 1: 当多个流做同样的事时，可以进行组合，比如小程序中列表页面刷新来自手动下来、进入页面、动态添加数据，可以组合成一个
 *
 *
 触发时间节点
 hot: 'a---b-----------c-------d-------|       '
 a_c: '----a---a---a---(a|)                    '
 b_c: '    ----b---b---(b|)                    '
 c_c: '                ----c---c---c---c---(c|)'
 d_c: '                        ----(d|)        '
 exp: '----a---(ab)(ab)(ab)c---c---(cd)c---(c|)'
 sub: '^                                   !   '
 *
 * @param project 待合并的流
 * @param resultSelector 对流的值进行处理
 * @param concurrent 同时并发的数量
 * @returns {function(*=): MergeMapSubscriber}
 */
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
