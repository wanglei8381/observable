import { isScheduler } from '../utils'
import { ArrayObservable } from './ArrayObservable'
import { EmptyObservable } from './EmptyObservable'
export const of = (...args) => {
  let scheduler = args[args.length - 1]
  if (isScheduler(scheduler)) {
    args.pop()
  } else {
    scheduler = null
  }
  if (args.length > 0) {
    return new ArrayObservable(args, scheduler)
  }
  return new EmptyObservable(scheduler)
}
