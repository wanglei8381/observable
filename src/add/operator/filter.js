import { filterOperator } from '../../operators/filter'
import { Observable } from '../../Observable'

Observable.prototype.filter = function (predicate, context) {
  return this.lift(filterOperator(predicate, context))
}
