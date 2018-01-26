import { concatMap } from '../../operators/concatMap'
import { Observable } from '../../Observable'

Observable.prototype.concatMap = function (project, resultSelector) {
  return this.lift(concatMap(project, resultSelector))
}
