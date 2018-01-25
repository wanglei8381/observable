import { doOperator } from '../../operators/do'
import { Observable } from '../../Observable'

Observable.prototype.do = function (nextOrObserver, error, complete) {
  return this.lift(doOperator(nextOrObserver, error, complete))
}
