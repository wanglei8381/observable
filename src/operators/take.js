export function takeOperator (number = Number.POSITIVE_INFINITY) {
  return observer => {
    let count = 0
    return val => {
      observer.next(val)
      count++
      if (count === number) {
        observer.complete()
      }
    }
  }
}
