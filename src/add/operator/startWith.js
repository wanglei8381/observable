import { startWithOperator } from '../../operators/startWith'
import { Observable } from '../../Observable'

Observable.prototype.startWith = function (...args) {
  return this.lift(startWithOperator(...args))
}
