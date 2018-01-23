import { isScheduler } from '../utils'
export function startWithOperator (...args) {
  const scheduler = args[args.length - 1]
  let hasScheduler = false
  if (isScheduler(scheduler)) {
    args.pop()
    hasScheduler = true
  }
  const length = args.length

  // 不能使用箭头函数
  const dispatch = function (state) {
    const { values, index, length, observer } = state
    if (index >= length) return
    observer.next(values[index])
    state.index = index + 1
    this.schedule(state)
  }
  return observer => {
    if (hasScheduler) {
      scheduler.schedule(dispatch, 0, {
        values: args,
        index: 0,
        length,
        observer
      })
    } else {
      for (let i = 0; i < length; i++) {
        observer.next(args[i])
      }
    }
  }
}
