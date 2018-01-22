export const doOperator = (next, error, complete) => observer => ({
  next (val) {
    next && next(val)
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
})
