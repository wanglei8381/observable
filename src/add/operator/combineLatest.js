import { combineLatestOperator } from '../../operators'
import { Observable } from '../../Observable'
import { isArray } from '../../utils'
import { ArrayObservable } from '../../observables/ArrayObservable'

// 没想到把数据源进行整合成一起，这样做确实方便很多
Observable.prototype.combineLatest = function (observables, project) {
  const streams = isArray(observables) ? observables : [observables]
  streams.unshift(this)
  return new ArrayObservable(streams).lift(combineLatestOperator(project))
}
