import { mergeMapOperator } from '../../operators'
import { Observable } from '../../Observable'

Observable.prototype.mergeMap = function (project, resultSelector, concurrent) {
  return this.lift(mergeMapOperator(project, resultSelector, concurrent))
}
