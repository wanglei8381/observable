import { delayOperator } from '../../operators/delay'
import { Observable } from '../../Observable'

Observable.prototype.delay = function (nextOrObserver, error, complete) {
  return this.lift(delayOperator(nextOrObserver, error, complete))
}
