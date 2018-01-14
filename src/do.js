import { Observable } from './Observable'

Observable.prototype.do = function (nextOrObserver, error, complete) {
  return this.lift(doOperator(nextOrObserver, error, complete))
}

function doOperator (next, error, complete) {
  return observer => {
    const subs = {
      next (val) {
        next(val)
        observer.next(val)
      },

      error (e) {
        error && error(e)
        observer.error(e)
      },

      complete () {
        complete && complete()
        observer.complete()
      }
    }

    return subs
  }
}
