import { startWithOperator } from '../../operators'
import { Observable } from '../../Observable'

Observable.prototype.startWith = function (...args) {
  return this.lift(startWithOperator(...args))
}
