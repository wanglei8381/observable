export function mapToOperator (value) {
  return observer => () => {
    observer.next(value)
  }
}
