export function mapOperator (project, context) {
  if (typeof project !== 'function') {
    throw new TypeError(
      'argument is not a function. Are you looking for `mapTo()`?'
    )
  }
  let index = 0
  return observer => val => {
    try {
      observer.next(project.call(context, val, index++))
    } catch (e) {
      observer.error(e)
    }
  }
}
