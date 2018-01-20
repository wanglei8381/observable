import { takeOperator } from '../../operators'
import { Observable } from '../../Observable'

Observable.prototype.take = function (number) {
  return this.lift(takeOperator(number))
}
