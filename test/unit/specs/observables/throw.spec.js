import { Observable } from '@'
import { ErrorObservable } from '@/observables/ErrorObservable'

describe('Observable.throw', function () {
  it('should create a cold observable that just emits an error', function () {
    var expected = '#'
    var e1 = Observable.throw('error')
    expectObservable(e1).toBe(expected)
  })

  it('should emit one value', function (done) {
    var calls = 0
    Observable.throw('bad').subscribe(
      function () {
        done(new Error('should not be called'))
      },
      function (err) {
        expect(++calls).toBe(1)
        expect(err).toBe('bad')
        done()
      }
    )
  })

  it('should create expose a error property', function () {
    var e = Observable.throw('error')
    expect(e['error']).toBe('error')
  })

  it('should create ErrorObservable via static create function', function () {
    var e = new ErrorObservable('error')
    var r = ErrorObservable.create('error')
    expect(e).toEqual(r)
  })

  it('should accept scheduler', function () {
    var e = Observable.throw('error', global.rxTestScheduler)
    expectObservable(e).toBe('#')
  })
})
