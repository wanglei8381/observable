import { takeOperator } from '../../operators/take'
import { Observable } from '../../Observable'

Observable.prototype.take = function (number) {
  return this.lift(takeOperator(number))
}
