import { distinctUntilChangedOperator } from '../../operators/distinctUntilChanged'
import { Observable } from '../../Observable'

Observable.prototype.distinctUntilChanged = function (compare, keySelector) {
  return this.lift(distinctUntilChangedOperator(compare, keySelector))
}
