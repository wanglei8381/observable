import { Subject } from './Subject'
export class AsyncSubject extends Subject {
  value = null
  hasNext = false
  hasCompleted = false

  _subscribe (observer) {
    if (this.hasError) {
      observer.error(this.thrownError)
    } else if (this.hasCompleted && this.hasNext) {
      observer.next(this.value)
      observer.complete()
    }
    return super._subscribe(observer)
  }

  next (value) {
    if (!this.hasCompleted) {
      this.value = value
      this.hasNext = true
    }
  }

  error (error) {
    if (!this.hasCompleted) {
      super.error(error)
    }
  }

  complete () {
    this.hasCompleted = true
    if (this.hasNext) {
      super.next(this.value)
    }
    super.complete()
  }
}
