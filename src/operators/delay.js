export function delayOperator (delay = 0, scheduler) {
  return observer => {
    const queue = []
    let count = 0
    let index = 0

    function execute () {
      const state = queue.shift()
      if (state.type === 'N') {
        setTimeout(() => {
          index++
          observer.next(state.value)
          if (count === index && queue.length > 0) {
            execute()
          }
        }, delay)
      } else if (state.type === 'E') {
        observer.error(state.value)
      } else {
        observer.complete()
      }
    }

    return {
      next (value) {
        queue.push({
          type: 'N',
          value
        })
        count++
        execute()
      },

      error (value) {
        queue.push({
          type: 'E',
          value
        })
      },

      complete () {
        queue.push({
          type: 'C'
        })
      }
    }
  }
}
