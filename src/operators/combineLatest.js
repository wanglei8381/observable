import { OuterSubscriber } from '../OuterSubscriber'
import { subscribeToResult } from '../utils/subscribeToResult'
const none = {}
export function combineLatestOperator (project) {
  return observer => new CombineLatestSubscriber(observer, project)
}

class CombineLatestSubscriber extends OuterSubscriber {
  constructor (destination, project) {
    super(destination)
    this.project = project
    this.observables = []
    this.values = []
    this.active = 0
    this.toRespond = 0
  }

  _next (observable) {
    this.values.push(none)
    this.observables.push(observable)
  }

  _complete () {
    const observables = this.observables
    const len = observables.length
    if (len === 0) {
      this.destination.complete()
    } else {
      this.active = len
      this.toRespond = len
      for (let i = 0; i < len; i++) {
        const observable = observables[i]
        this.add(subscribeToResult(this, observable, observable, i))
      }
    }
  }

  _tryProject (values) {
    try {
      const data = this.project.apply(this, values)
      this.destination.next(data)
    } catch (err) {
      this.destination.error(err)
    }
  }

  notifyNext (outerValue, innerValue, outerIndex, innerIndex) {
    const values = this.values
    const oldVal = values[outerIndex]
    const toRespond = !this.toRespond
      ? 0
      : oldVal === none ? --this.toRespond : this.toRespond

    values[outerIndex] = innerValue

    if (toRespond === 0) {
      if (this.project) {
        this._tryProject(values)
      } else {
        this.destination.next(values.slice())
      }
    }
  }

  notifyComplete () {
    if ((this.active -= 1) === 0) {
      this.destination.complete()
    }
  }
}
