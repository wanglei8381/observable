import { merge } from '../../observables/merge'
import { Observable } from '../../Observable'

Observable.prototype.merge = function (...observables) {
  return merge.call(this, this, ...observables)
}
