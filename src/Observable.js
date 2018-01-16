import { toSubscriber } from './Subscriber'
import { observable as $$observable } from './symbol'
export class Observable {
  constructor (subscribe) {
    if (subscribe) {
      this._subscribe = subscribe
    }
  }

  lift (operator) {
    const observable = new Observable()
    observable.source = this
    observable.operator = operator
    return observable
  }

  subscribe (observerOrNext, error, complete) {
    const observer = toSubscriber(observerOrNext, error, complete)

    if (this.operator) {
      const subscrition = toSubscriber(this.operator(observer))
      observer.add(subscrition)
      this.source.subscribe(subscrition)
    } else if (this._subscribe) {
      // 存在source，source当最数据源（如subject中的asObservable）
      observer.add(
        this.source ? this._subscribe(observer) : this._trySubscribe(observer)
      )
    }

    // 当在next中出错时，抛出错误对象
    if (observer.errorValue && observer.errorSource === 'next') {
      throw observer.errorValue
    }

    return observer
  }

  // 在订阅时出错要通知error，但不会抛出
  _trySubscribe (observer) {
    try {
      return this._subscribe(observer)
    } catch (e) {
      observer.syncError = e
      observer.error(e)
    }
  }

  _subscribe (observer) {
    return this.source.subscribe(observer)
  }

  [$$observable] () {
    return this
  }

  static create (subscriber) {
    return new Observable(subscriber)
  }
}
