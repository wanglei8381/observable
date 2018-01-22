import { mapOperator } from '../../operators'
import { Observable } from '../../Observable'

Observable.prototype.map = function (project, context) {
  return this.lift(mapOperator(project, context))
}
