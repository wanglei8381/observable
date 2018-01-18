import { Observable, Scheduler } from '@'
import { EmptyObservable } from '@/observables/EmptyObservable'
import { ArrayObservable } from '@/observables/ArrayObservable'
import { ScalarObservable } from '@/observables/ScalarObservable'

describe('Observable.of', function () {
  it.skip('of(1, 2, 3): should create a cold observable that emits 1, 2, 3', function () {
    var e1 = Observable.of(1, 2, 3).concatMap(function (x, i) {
      return Observable.of(x).delay(i === 0 ? 0 : 20, rxTestScheduler)
    })
    var expected = 'x-y-(z|)'
    expectObservable(e1).toBe(expected, { x: 1, y: 2, z: 3 })
  })

  it('should create an observable from the provided values', function (done) {
    var x = { foo: 'bar' }
    var expected = [1, 'a', x]
    var i = 0
    Observable.of(1, 'a', x).subscribe(
      function (y) {
        expect(y).toBe(expected[i++])
      },
      function (x) {
        done(new Error('should not be called'))
      },
      function () {
        done()
      }
    )
  })

  it('should return a scalar observable if only passed one value', function () {
    var obs = Observable.of('one')
    expect(obs instanceof ScalarObservable).toBeTruthy()
  })

  it('should return a scalar observable if only passed one value and a scheduler', function () {
    var obs = Observable.of('one', Scheduler.queue)
    expect(obs instanceof ScalarObservable).toBeTruthy()
  })

  it('should return an array observable if passed many values', function () {
    var obs = Observable.of('one', 'two', 'three')
    expect(obs instanceof ArrayObservable).toBeTruthy()
  })

  it('should return an empty observable if passed no values', function () {
    var obs = Observable.of()
    expect(obs instanceof EmptyObservable).toBeTruthy()
  })

  it('should return an empty observable if passed only a scheduler', function () {
    var obs = Observable.of(Scheduler.queue)
    expect(obs instanceof EmptyObservable).toBeTruthy()
  })

  it('should emit one value', function (done) {
    var calls = 0
    Observable.of(42).subscribe(
      function (x) {
        expect(++calls).toBe(1)
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

  it.skip('should handle an Observable as the only value', function () {
    var source = Observable.of(
      Observable.of('a', 'b', 'c', rxTestScheduler),
      rxTestScheduler
    )
    expect(source instanceof ScalarObservable).toBeTruthy()
    var result = source.concatAll()
    expectObservable(result).toBe('(abc|)')
  })

  it.skip('should handle many Observable as the given values', function () {
    var source = Observable.of(
      Observable.of('a', 'b', 'c', rxTestScheduler),
      Observable.of('d', 'e', 'f', rxTestScheduler),
      rxTestScheduler
    )
    expect(source instanceof ArrayObservable).toBeTruthy()
    var result = source.concatAll()
    expectObservable(result).toBe('(abcdef|)')
  })
})
