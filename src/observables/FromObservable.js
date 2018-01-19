import { Observable } from '../Observable'
import { ArrayObservable } from './ArrayObservable'
import { ArrayLikeObservable } from './ArrayLikeObservable'
import { PromiseObservable } from './PromiseObservable'
import { IteratorObservable } from './IteratorObservable'
import { ObserveOnSubscriber } from '../operators/observeOn'
import {
  observable as SymbolObservable,
  iterator as SymbolIterator
} from '../symbol'
import { isFunction, isArrayLike, isPromise, isArray, isString } from '../utils'

export class FromObservable extends Observable {
  constructor (ish, scheduler) {
    super()
    this.ish = ish
    this.scheduler = scheduler
  }

  _subscribe (observer) {
    const { ish, scheduler } = this
    if (scheduler == null) {
      return ish[SymbolObservable]().subscribe(observer)
    } else {
      return ish[SymbolObservable]().subscribe(
        new ObserveOnSubscriber(observer, scheduler, 0)
      )
    }
  }

  static create (ish, scheduler) {
    if (ish != null) {
      if (isFunction(ish[SymbolObservable])) {
        if (ish instanceof Observable && !scheduler) {
          return ish
        }
        return new FromObservable(ish, scheduler)
      }

      if (isArray(ish)) {
        return new ArrayObservable(ish, scheduler)
      }

      if (isPromise(ish)) {
        return new PromiseObservable(ish, scheduler)
      }

      if (isFunction(ish[SymbolIterator]) || isString(ish)) {
        return new IteratorObservable(ish, scheduler)
      }

      if (isArrayLike(ish)) {
        return ArrayLikeObservable.create(ish, scheduler)
      }
    }
    throw new TypeError(
      ((ish !== null && typeof ish) || ish) + ' is not observable'
    )
  }
}
