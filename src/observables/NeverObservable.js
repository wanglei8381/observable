import { Observable } from '../Observable'

export class NeverObservable extends Observable {
  static create () {
    return new NeverObservable()
  }

  _subscribe () {}
}
