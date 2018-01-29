import { debounceTimeOperator } from '../../operators/debounceTime'
import { Observable } from '../../Observable'

Observable.prototype.debounceTime = function (dueTime, schduler) {
  return this.lift(debounceTimeOperator(dueTime, schduler))
}
