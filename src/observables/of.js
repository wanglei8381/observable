import { isScheduler } from '../utils'
import { ArrayObservable } from './ArrayObservable'
import { EmptyObservable } from './EmptyObservable'
import { ScalarObservable } from './ScalarObservable'
export const of = (...args) => {
  let scheduler = args[args.length - 1]
  if (isScheduler(scheduler)) {
    args.pop()
  } else {
    scheduler = null
  }
  const length = args.length
  if (length === 1) {
    return new ScalarObservable(args[0], scheduler)
  } else if (length > 1) {
    return new ArrayObservable(args, scheduler)
  }
  return new EmptyObservable(scheduler)
}
