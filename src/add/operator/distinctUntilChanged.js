import { distinctUntilChangedOperator } from '../../operators'
import { Observable } from '../../Observable'

Observable.prototype.distinctUntilChanged = function (compare, keySelector) {
  return this.lift(distinctUntilChangedOperator(compare, keySelector))
}
