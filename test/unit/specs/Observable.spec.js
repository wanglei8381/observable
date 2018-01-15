import { Observable, Subscription, toSubscriber } from '@'

expect.extend({
  type (received, argument) {
    /* eslint-disable valid-typeof */
    const pass = typeof received === argument
    return {
      message: () => `期望的类型是${argument}，实际返回的是${typeof received}`,
      pass
    }
  }
})

function expectFullObserver (val) {
  expect(val).type('object')
  expect(val.next).type('function')
  expect(val.error).type('function')
  expect(val.complete).type('function')
  expect(val.closed).type('boolean')
}

describe('Observable', () => {
  it('应该能够正常创建Observable实例', () => {
    const source = new Observable(function (observer) {
      expectFullObserver(observer)
      observer.next(1)
      observer.complete()
    })
    const fn = jest.fn()
    source.subscribe(
      x => {
        expect(x).toBe(1)
      },
      null,
      fn
    )
    expect(fn).toHaveBeenCalled()
  })

  it('在构造函数中抛出错误应该能传递到error中', () => {
    const source = new Observable(function (observer) {
      throw new Error('1')
    })
    source.subscribe({
      error (e) {
        expect(e.message).toBe('1')
      }
    })
  })
})

describe('subscribe', () => {
  it('同步执行', () => {
    let subscribed = false
    let nexted
    let completed
    const source = new Observable(function (observer) {
      subscribed = true
      observer.next('wee')
      expect(nexted).toBe('wee')
      observer.complete()
      expect(completed).toBeTruthy()
    })
    expect(subscribed).toBeFalsy()
    let mutatedByNext = false
    let mutatedByComplete = false
    source.subscribe(
      function (x) {
        nexted = x
        mutatedByNext = true
      },
      null,
      function () {
        completed = true
        mutatedByComplete = true
      }
    )
    expect(mutatedByNext).toBeTruthy()
    expect(mutatedByComplete).toBeTruthy()
  })

  it('无参数调用subscribe', () => {
    const source = new Observable(function (observer) {
      observer.next(1)
      observer.complete()
    })
    source.subscribe()
  })

  it('当一个错误同步发出且无参数调用subscribe时，应该执行unsubscription', () => {
    var unsubscribeCalled = false
    var source = new Observable(function (observer) {
      observer.error(0)
      return function () {
        unsubscribeCalled = true
      }
    })
    try {
      source.subscribe()
    } catch (e) {}
    expect(unsubscribeCalled).toBeTruthy()
  })

  it('当一个错误异步发出且无参数调用subscribe时，应该执行unsubscription', done => {
    var unsubscribeCalled = false
    var id
    var source = new Observable(function (observer) {
      id = setInterval(() => {
        try {
          observer.error(0)
        } catch (e) {}
      }, 1)
      return function () {
        clearInterval(id)
        unsubscribeCalled = true
      }
    })
    source.subscribe()
    setTimeout(() => {
      var err
      var errHappened = false
      try {
        expect(unsubscribeCalled).toBeTruthy()
      } catch (e) {
        err = e
        errHappened = true
      } finally {
        if (!errHappened) {
          done()
        } else {
          done(err)
        }
      }
    }, 100)
  })

  it('调用subscribe时，应该返回Subscription可以调用unsubscribe', () => {
    var unsubscribeCalled = false
    var source = new Observable(function () {
      return function () {
        unsubscribeCalled = true
      }
    })
    var sub = source.subscribe(function () {
      // noop
    })
    expect(sub instanceof Subscription).toBeTruthy()
    expect(unsubscribeCalled).toBeFalsy()
    expect(sub.unsubscribe).type('function')
    sub.unsubscribe()
    expect(unsubscribeCalled).toBeTruthy()
  })

  it('当在next中出现同步错误时，应该执行unsubscribe', () => {
    var messageError = false
    var messageErrorValue = false
    var unsubscribeCalled = false
    var sub
    var source = new Observable(function (observer) {
      observer.next('boo!')
      return function () {
        unsubscribeCalled = true
      }
    })
    try {
      sub = source.subscribe(function (x) {
        throw x
      })
    } catch (e) {
      messageError = true
      messageErrorValue = e
    }
    expect(sub).toBeUndefined()
    expect(unsubscribeCalled).toBeTruthy()
    expect(messageError).toBeTruthy()
    expect(messageErrorValue).toBe('boo!')
  })

  it('当在subscriber的next中出现同步错误时，应该执行unsubscribe', () => {
    var messageError = false
    var messageErrorValue = false
    var unsubscribeCalled = false
    var sub
    var subscriber = toSubscriber(function (x) {
      throw x
    })
    var source = new Observable(function (observer) {
      observer.next('boo!')
      return function () {
        unsubscribeCalled = true
      }
    })
    try {
      sub = source.subscribe(subscriber)
    } catch (e) {
      messageError = true
      messageErrorValue = e
    }
    expect(sub).toBeUndefined()
    expect(subscriber.closed).toBeTruthy()
    expect(unsubscribeCalled).toBeTruthy()
    expect(messageError).toBeTruthy()
    expect(messageErrorValue).toBe('boo!')
  })

  it('当执行unsubscription，next的信息将忽略', () => {
    var times = 0
    new Observable(function (observer) {
      observer.next(0)
      observer.next(0)
      observer.next(0)
      observer.next(0)
    })
      .do(function () {
        return (times += 1)
      })
      .subscribe(function () {
        if (times === 2) {
          this.unsubscribe()
        }
      })
    expect(times).toBe(2)
  })

  it('should ignore error messages after unsubscription', function () {
    var times = 0
    var errorCalled = false
    new Observable(function (observer) {
      observer.next(0)
      observer.next(0)
      observer.next(0)
      observer.error(0)
    })
      .do(function () {
        return (times += 1)
      })
      .subscribe(
        function () {
          if (times === 2) {
            this.unsubscribe()
          }
        },
        () => {
          errorCalled = true
        }
      )
    expect(times).toBe(2)
    expect(errorCalled).toBeFalsy()
  })

  it('should ignore complete messages after unsubscription', function () {
    var times = 0
    var completeCalled = false
    new Observable(function (observer) {
      observer.next(0)
      observer.next(0)
      observer.next(0)
      observer.complete()
    })
      .do(function () {
        return (times += 1)
      })
      .subscribe(
        function () {
          if (times === 2) {
            this.unsubscribe()
          }
        },
        null,
        () => {
          completeCalled = true
        }
      )
    expect(times).toBe(2)
    expect(completeCalled).toBeFalsy()
  })
})

describe('Observable.create', () => {
  it('should create an Observable', () => {
    const stream = Observable.create(function (obs) {})
    expect(stream instanceof Observable).toBeTruthy()
  })

  it('should provide an observer to the function', function () {
    var called = false
    var result = Observable.create(function (observer) {
      called = true
      expectFullObserver(observer)
      observer.complete()
    })
    expect(called).toBeFalsy()
    result.subscribe(function () {
      // noop
    })
    expect(called).toBeTruthy()
  })

  it('should send errors thrown in the passed function down the error path', function (done) {
    Observable.create(function (observer) {
      throw new Error('this should be handled')
    }).subscribe({
      error: function (err) {
        expect(err).toEqual(new Error('this should be handled'))
        done()
      }
    })
  })
})
