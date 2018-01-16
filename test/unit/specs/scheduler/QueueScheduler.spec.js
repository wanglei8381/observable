import { Scheduler } from '@'
const queue = Scheduler.queue

describe('queue', () => {
  it('should schedule things recursively', function () {
    var call1 = false
    var call2 = false
    queue.active = false
    queue.schedule(function () {
      call1 = true
      queue.schedule(function () {
        call2 = true
      })
    })
    expect(call1).toBeTruthy()
    expect(call2).toBeTruthy()
  })

  it('should schedule things recursively via this.schedule', function () {
    var call1 = false
    var call2 = false
    queue.active = false
    queue.schedule(
      function (state) {
        call1 = state.call1
        call2 = state.call2
        if (!call2) {
          this.schedule({ call1: true, call2: true })
        }
      },
      0,
      { call1: true, call2: false }
    )
    expect(call1).toBeTruthy()
    expect(call2).toBeTruthy()
  })

  it('should schedule things in the future too', function (done) {
    var called = false
    queue.schedule(function () {
      called = true
    }, 60)
    setTimeout(function () {
      expect(called).toBeFalsy()
    }, 20)
    setTimeout(function () {
      expect(called).toBeTruthy()
      done()
    }, 100)
  })

  it('should be reusable after an error is thrown during execution', function (done) {
    var results = []
    expect(function () {
      queue.schedule(function () {
        results.push(1)
      })
      queue.schedule(function () {
        throw new Error('bad')
      })
    }).toThrow('bad')

    setTimeout(function () {
      queue.schedule(function () {
        results.push(2)
        done()
      })
    }, 0)
  })
})
