import { Subscriber } from '../Subscriber'
import { isArray } from '../utils'
export function combineLatestOperator (others, project) {
  return observer => new CombineLatestSubscriber(observer, others, project)
}

class CombineLatestSubscriber extends Subscriber {
  constructor (destination, others, project) {
    super(destination)
    this.streams = isArray(others) ? others : [others]
    this.initState()
    this.project = project
    this.allHasValue = false
    this.observeOnStreams()
  }

  initState () {
    const size = (this.size = this.streams.length + 1)
    const states = (this.states = new Array(this.size))
    for (let i = 0; i < size; i++) {
      states[i] = {
        hasValue: false,
        value: undefined,
        isStopped: false
      }
    }
  }

  _next (value) {
    this.setNext(0, value)
  }

  _error (err) {
    this.notifyError(err)
  }

  _complete () {
    this.setComplete(0)
    this.unsubscribe()
  }

  _tryProject (values) {
    try {
      const data = this.project.apply(this, values)
      this.destination.next(data)
    } catch (err) {
      this.notifyError(err)
    }
  }

  notifyNext () {
    const { states, size } = this
    if (!this.allHasValue) {
      const res = states.filter(state => state.hasValue)
      this.allHasValue = res.length === size
    }

    if (this.allHasValue) {
      const values = states.map(state => state.value)
      this._tryProject(values)
    }
  }

  notifyComplete () {
    const res = this.states.filter(state => state.isStopped)
    if (res.length === this.size) {
      this.destination.complete()
    }
  }

  notifyError (err) {
    this.destination.error(err)
    this.streams.forEach(stream => {
      stream.error(err)
    })
  }

  setNext (index, value) {
    const state = this.states[index]
    state.hasValue = true
    state.value = value
    this.notifyNext()
  }

  setComplete (index) {
    this.states[index].isStopped = true
    this.notifyComplete()
  }

  observeOnStreams () {
    const subs = this.streams.map((stream, index) =>
      stream.subscribe(
        value => {
          this.setNext(index + 1, value)
        },

        err => {
          this.notifyError(err)
        },

        () => {
          this.setComplete(index + 1)
        }
      )
    )

    this.add(subs)
  }
}
