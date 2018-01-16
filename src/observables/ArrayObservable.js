import { Observable } from '../Observable'
export class ArrayObservable extends Observable {
  constructor (array, scheduler) {
    super()
    this.array = array
    this.scheduler = scheduler
  }

  _subscribe (observer) {
    const { array, scheduler } = this
    const len = array.length
    if (scheduler) {
      scheduler.schedule(ArrayObservable.dispatch, {
        array,
        observer,
        index: 0,
        count: len
      })
    } else {
      for (let i = 0; i < len; i++) {
        observer.next(array[i])
      }
      observer.complete()
    }
  }

  static create (array, scheduler) {
    return new ArrayObservable(array, scheduler)
  }

  static dispatch (state) {
    const { observer, index, array, count } = state
    // 数据发送完毕
    if (index >= count) return
    // 在observer关闭以后也可以发送
    observer.next(array[index])
    if (observer.closed) return
    state.index = index + 1
    // 继续调用后续数据, this会绑定到scheduler的action上
    this.schedule(state)
  }
}
