import { OuterSubscriber } from '../OuterSubscriber'
import { subscribeToResult } from '../utils/subscribeToResult'
export function withLatestFromOperator (observables, project) {
  return observer =>
    new WithLatestFromSubscriber(observer, observables, project)
}

class WithLatestFromSubscriber extends OuterSubscriber {
  constructor (destination, observables, project) {
    super(destination)
    this.project = project
    this.observables = observables
    this.toRespond = []
    const len = observables.length
    this.values = new Array(len)

    for (let i = 0; i < len; i++) {
      this.toRespond.push(i)
      let observable = observables[i]
      this.add(subscribeToResult(this, observable, observable, i))
    }
  }

  notifyNext (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    this.values[outerIndex] = innerValue
    const toRespond = this.toRespond
    if (toRespond.length > 0) {
      const found = toRespond.indexOf(outerIndex)
      if (found !== -1) {
        toRespond.splice(found, 1)
      }
    }
  }

  notifyComplete () {
    // noop
  }

  _next (value) {
    if (this.toRespond.length === 0) {
      const args = [value, ...this.values]
      if (this.project) {
        this._tryProject(args)
      } else {
        this.destination.next(args)
      }
    }
  }

  _tryProject (args) {
    let result
    try {
      result = this.project.apply(this, args)
    } catch (err) {
      this.destination.error(err)
      return
    }
    this.destination.next(result)
  }
}
