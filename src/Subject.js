import { Observable } from './Observable'
import { ObjectUnsubscribedError } from './utils'
import { rxSubscriber as rxSubscriberSymbol } from './symbol'
export class Subject extends Observable {
  constructor () {
    super()
    this.closed = false
    this.isStopped = false
    this.observers = []
    this.hasError = false
    this.thrownError = null
  }

  lift (operator) {
    const subject = new Subject()
    subject.operator = operator
    return subject
  }

  next (state) {
    if (this.closed) {
      throw new ObjectUnsubscribedError()
    }
    if (!this.isStopped) {
      iterateObserver(this.observers, 'next', state)
    }
  }

  error (e) {
    if (this.closed) {
      throw new ObjectUnsubscribedError()
    }
    if (!this.isStopped) {
      this.hasError = true
      this.thrownError = e
      this.isStopped = true
      iterateObserver(this.observers, 'error', e)
      this.observers = []
    }
  }

  complete () {
    if (this.closed) {
      throw new ObjectUnsubscribedError()
    }
    if (!this.isStopped) {
      this.isStopped = true
      iterateObserver(this.observers, 'complete')
      this.observers = []
    }
  }

  unsubscribe () {
    this.closed = true
    this.isStopped = true
    this.observers = []
  }

  _trySubscribe (observer) {
    if (this.closed) {
      throw new ObjectUnsubscribedError()
    } else {
      return super._trySubscribe(observer)
    }
  }

  _subscribe (observer) {
    if (this.hasError) {
      observer.error(this.thrownError)
    } else if (this.isStopped) {
      observer.complete()
    } else {
      this.observers.push(observer)
      // 释放资源
      return () => subjectSubscription(this, observer)
    }
  }

  asObservable () {
    const observable = new Observable()
    observable.source = this
    return observable
  }

  static create (destination, source) {
    return new AnonymousSubject(destination, source)
  }

  // Subject -> Subscriber
  [rxSubscriberSymbol] () {
    const subject = this
    return {
      next (val) {
        subject.next(val)
      },
      error (e) {
        subject.error(e)
      },
      complete () {
        subject.complete()
      }
    }
  }
}

export class AnonymousSubject extends Subject {
  constructor (destination, source) {
    super()
    this.dest = destination
    this.source = source
  }

  next (value) {
    if (this.dest && this.dest.next) {
      this.dest.next(value)
    }
  }

  error (err) {
    if (this.dest && this.dest.error) {
      this.dest.error(err)
    }
  }

  complete () {
    if (this.dest && this.dest.complete) {
      this.dest.complete()
    }
  }

  _subscribe (observer) {
    if (this.source) {
      return this.source.subscribe(observer)
    }
  }
}

function iterateObserver (observers, key, val) {
  const len = observers.length
  const list = observers.slice()
  for (let i = 0; i < len; i++) {
    list[i][key](val)
  }
}

function subjectSubscription (subject, observer) {
  if (subject.closed || subject.isStopped || subject.observers.length === 0) {
    return
  }
  const index = subject.observers.indexOf(observer)
  if (index !== -1) {
    subject.observers.splice(index, 1)
  }
}
