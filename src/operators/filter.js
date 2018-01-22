export function filterOperator (predicate, context) {
  let index = 0
  return observer => val => {
    try {
      if (predicate.call(context, val, index++)) {
        observer.next(val)
      }
    } catch (e) {
      observer.error(e)
    }
  }
}
