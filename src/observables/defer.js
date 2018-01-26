import { Observable } from '../Observable'
import { OuterSubscriber } from '../OuterSubscriber'
import { subscribeToResult } from '../utils/subscribeToResult'
export class DeferObservable extends Observable {
  constructor (observableFactory) {
    super()
    this.observableFactory = observableFactory
  }

  _subscribe (subscriber) {
    return new DeferSubscriber(subscriber, this.observableFactory)
  }

  static create (observableFactory) {
    return new DeferObservable(observableFactory)
  }
}

class DeferSubscriber extends OuterSubscriber {
  constructor (destination, factory) {
    super(destination)
    this.factory = factory
    this.tryDefer()
  }

  tryDefer () {
    try {
      this._callFactory()
    } catch (err) {
      this._error(err)
    }
  }

  _callFactory () {
    const result = this.factory()
    if (result) {
      this.add(subscribeToResult(this, result))
    }
  }
}
