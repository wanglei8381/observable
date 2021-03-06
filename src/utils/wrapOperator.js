import { toSubscriber, Subscriber } from '../Subscriber'
import { isFunction, isObject } from './type'

const subscritionActions = ['next', 'error', 'complete']
export function wrapOperator (operator) {
  return function operatorWrapper (observer) {
    let _subscrition = {
      next (value) {
        observer.next(value)
      },

      error (err) {
        observer.error(err)
      },

      complete () {
        observer.complete()
      }
    }

    const res = operator(observer)
    if (res === false) return
    if (isFunction(res)) {
      _subscrition.next = res
    } else if (res instanceof Subscriber) {
      _subscrition = res
    } else if (isObject(res)) {
      for (let i = 0; i < 3; i++) {
        const action = subscritionActions[i]
        if (isFunction(res[action])) {
          _subscrition[action] = res[action]
        }
      }
    }

    const subscrition = toSubscriber(_subscrition)
    observer.add(subscrition)
    this.source.subscribe(subscrition)
  }
}
