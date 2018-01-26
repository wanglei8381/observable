import { concatMapTo } from '../../operators/concatMapTo'
import { Observable } from '../../Observable'

Observable.prototype.concatMapTo = function (innerObservable, resultSelector) {
  return this.lift(concatMapTo(innerObservable, resultSelector))
}
