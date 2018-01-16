import { Subject } from './Subject'
import { Scheduler } from './Scheduler'
import { ObjectUnsubscribedError } from './utils'
export class ReplaySubject extends Subject {
  constructor (
    bufferSize = Number.POSITIVE_INFINITY,
    windowTime = Number.POSITIVE_INFINITY,
    scheduler
  ) {
    super()
    this._bufferSize = bufferSize < 1 ? 1 : bufferSize
    this._windowTime = windowTime < 1 ? 1 : windowTime
    this.scheduler = scheduler
    this._events = []
  }

  next (value) {
    this._events.push({
      time: this._getNow(),
      value
    })
    // 避免数据添加过多
    this._trimBufferThenGetEvents()
    super.next(value)
  }

  _subscribe (observer) {
    const events = this._trimBufferThenGetEvents()
    const scheduler = this.scheduler
    // 在ReplaySubject中关闭了还订阅会报错
    if (this.closed) {
      throw new ObjectUnsubscribedError()
    }
    let subscription
    if (!this.hasError && !this.isStopped) {
      subscription = super._subscribe(observer)
    }

    if (scheduler) {
      // observer = new ObserveOnSubscriber(observer, scheduler)
      // observer.add(observer)
    }

    const length = events.length
    for (let i = 0; i < length; i++) {
      observer.next(events[i].value)
    }

    if (this.hasError) {
      observer.error(this.thrownError)
    } else if (this.isStopped) {
      observer.complete()
    }

    return subscription
  }

  _getNow () {
    return (this.scheduler || Scheduler).now()
  }

  _trimBufferThenGetEvents () {
    const { _events, _bufferSize, _windowTime } = this
    let length = _events.length
    const now = this._getNow()
    let index = 0
    if (length > _bufferSize) {
      _events.splice(0, length - _bufferSize)
    }

    if (_windowTime === Number.POSITIVE_INFINITY) {
      return _events
    }

    length = _events.length
    while (index < length) {
      if (now - _events[index].time < _windowTime) {
        break
      }
      index++
    }
    _events.splice(0, index)
    return _events
  }
}
