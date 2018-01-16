import { doOperator } from '../../operators'
import { Observable } from '../../Observable'

Observable.prototype.do = function (nextOrObserver, error, complete) {
  return this.lift(doOperator(nextOrObserver, error, complete))
}
