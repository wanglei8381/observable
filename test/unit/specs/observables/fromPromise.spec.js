import { Observable, Scheduler } from '@'

describe('Observable.fromPromise', function () {
  it('should emit one value from a resolved promise', function (done) {
    var promise = Promise.resolve(42)
    Observable.fromPromise(promise).subscribe(
      function (x) {
        expect(x).toBe(42)
      },
      function () {
        done(new Error('should not be called'))
      },
      function () {
        done()
      }
    )
  })

  it('should raise error from a rejected promise', function (done) {
    var promise = Promise.reject(new Error('bad'))
    Observable.fromPromise(promise).subscribe(
      function (x) {
        done(new Error('should not be called'))
      },
      function (e) {
        expect(e).toEqual(new Error('bad'))
        done()
      },
      function () {
        done(new Error('should not be called'))
      }
    )
  })

  it('should share the underlying promise with multiple subscribers', function (done) {
    var promise = Promise.resolve(42)
    var observable = Observable.fromPromise(promise)
    observable.subscribe(
      function (x) {
        expect(x).toBe(42)
      },
      function () {
        done(new Error('should not be called'))
      },
      null
    )
    setTimeout(function () {
      observable.subscribe(
        function (x) {
          expect(x).toBe(42)
        },
        function () {
          done(new Error('should not be called'))
        },
        function () {
          done()
        }
      )
    })
  })

  it('should accept already-resolved Promise', function (done) {
    var promise = Promise.resolve(42)
    promise.then(
      function (x) {
        expect(x).toBe(42)
        Observable.fromPromise(promise).subscribe(
          function (y) {
            expect(y).toBe(42)
          },
          function () {
            done(new Error('should not be called'))
          },
          function () {
            done()
          }
        )
      },
      function () {
        done(new Error('should not be called'))
      }
    )
  })

  it('should emit a value from a resolved promise on a separate scheduler', function (done) {
    var promise = Promise.resolve(42)
    Observable.fromPromise(promise, Scheduler.asap).subscribe(
      function (x) {
        expect(x).toBe(42)
      },
      function () {
        done(new Error('should not be called'))
      },
      function () {
        done()
      }
    )
  })

  it('should raise error from a rejected promise on a separate scheduler', function (done) {
    var promise = Promise.reject(new Error('bad'))
    Observable.fromPromise(promise, Scheduler.asap).subscribe(
      function () {
        done(new Error('should not be called'))
      },
      function (e) {
        expect(e).toEqual(new Error('bad'))
        done()
      },
      function () {
        done(new Error('should not be called'))
      }
    )
  })

  it('should share the underlying promise with multiple subscribers on a separate scheduler', function (done) {
    var promise = Promise.resolve(42)
    var observable = Observable.fromPromise(promise, Scheduler.asap)
    observable.subscribe(
      function (x) {
        expect(x).toBe(42)
      },
      function () {
        done(new Error('should not be called'))
      },
      null
    )
    setTimeout(function () {
      observable.subscribe(
        function (x) {
          expect(x).toBe(42)
        },
        function () {
          done(new Error('should not be called'))
        },
        function () {
          done()
        }
      )
    })
  })

  it('should not emit, throw or complete if immediately unsubscribed', function (done) {
    var nextSpy = jest.fn()
    var throwSpy = jest.fn()
    var completeSpy = jest.fn()
    var promise = Promise.resolve(42)
    var subscription = Observable.fromPromise(promise).subscribe(
      nextSpy,
      throwSpy,
      completeSpy
    )
    subscription.unsubscribe()
    setTimeout(function () {
      expect(nextSpy).not.toHaveBeenCalled()
      expect(throwSpy).not.toHaveBeenCalled()
      expect(completeSpy).not.toHaveBeenCalled()
      done()
    })
  })
})
