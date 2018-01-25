import { mergeMapOperator } from '../../operators/mergeMap'
import { Observable } from '../../Observable'

Observable.prototype.mergeAll = function (concurrent) {
  return this.lift(mergeMapOperator(observable => observable, null, concurrent))
}
