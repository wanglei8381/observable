import { withLatestFromOperator } from '../../operators/withLatestFrom'
import { Observable } from '../../Observable'
import { isFunction } from '../../utils'

Observable.prototype.withLatestFrom = function (...observables) {
  let project
  if (isFunction(observables[observables.length - 1])) {
    project = observables.pop()
  }
  return this.lift(withLatestFromOperator(observables, project))
}
