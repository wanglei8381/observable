import { mapToOperator } from '../../operators/mapTo'
import { Observable } from '../../Observable'

Observable.prototype.mapTo = function (value) {
  return this.lift(mapToOperator(value))
}
