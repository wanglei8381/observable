import { Observable, Scheduler } from '@'
import sinon from 'sinon'
var asap = Scheduler.asap
var queue = Scheduler.queue
var animationFrame = Scheduler.animationFrame

describe('Observable.interval', function () {
  it.skip('interval(1000) should create an observable emitting periodically', function () {
    var e1 = Observable.interval(20, rxTestScheduler)
      .take(6) // make it actually finite, so it can be rendered
      .concat(Observable.never()) // but pretend it's infinite by not completing
    var expected = '--a-b-c-d-e-f-'
    var values = {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
      e: 4,
      f: 5
    }
    expectObservable(e1).toBe(expected, values)
  })
  it('should set up an interval', function () {
    var expected =
      '----------0---------1---------2---------3---------4---------5---------6-----'
    expectObservable(Observable.interval(100, rxTestScheduler)).toBe(expected, [
      0,
      1,
      2,
      3,
      4,
      5,
      6
    ])
  })
  it('should specify default scheduler if incorrect scheduler specified', function () {
    var scheduler = Observable.interval(10, sinon.stub()).scheduler
    expect(scheduler).toBe(Scheduler.async)
  })
  it('should emit when relative interval set to zero', function () {
    var e1 = Observable.interval(0, rxTestScheduler).take(7)
    var expected = '(0123456|)'
    expectObservable(e1).toBe(expected, [0, 1, 2, 3, 4, 5, 6])
  })
  it('should consider negative interval as zero', function () {
    var e1 = Observable.interval(-1, rxTestScheduler).take(7)
    var expected = '(0123456|)'
    expectObservable(e1).toBe(expected, [0, 1, 2, 3, 4, 5, 6])
  })
  it('should emit values until unsubscribed', function (done) {
    var values = []
    var expected = [0, 1, 2, 3, 4, 5, 6]
    var e1 = Observable.interval(5)
    var subscription = e1.subscribe(
      function (x) {
        values.push(x)
        if (x === 6) {
          subscription.unsubscribe()
          expect(values).toEqual(expected)
          done()
        }
      },
      function () {
        done(new Error('should not be called'))
      },
      function () {
        done(new Error('should not be called'))
      }
    )
  })
  it('should create an observable emitting periodically with the AsapScheduler', function (done) {
    var sandbox = sinon.sandbox.create()
    var fakeTimer = sandbox.useFakeTimers()
    var interval = 10
    var events = [0, 1, 2, 3, 4, 5]
    var source = Observable.interval(interval, asap).take(6)
    source.subscribe({
      next: function (x) {
        expect(x).toBe(events.shift())
      },
      error: function (e) {
        sandbox.restore()
        done(e)
      },
      complete: function () {
        expect(asap.actions.length).toBe(0)
        expect(asap.scheduled).toBe(undefined)
        sandbox.restore()
        done()
      }
    })
    var i = -1
    var n = events.length
    while (++i < n) {
      fakeTimer.tick(interval)
    }
  })
  it('should create an observable emitting periodically with the QueueScheduler', function (done) {
    var sandbox = sinon.sandbox.create()
    var fakeTimer = sandbox.useFakeTimers()
    var interval = 10
    var events = [0, 1, 2, 3, 4, 5]
    var source = Observable.interval(interval, queue).take(6)
    source.subscribe({
      next: function (x) {
        expect(x).toBe(events.shift())
      },
      error: function (e) {
        sandbox.restore()
        done(e)
      },
      complete: function () {
        expect(queue.actions.length).toBe(0)
        expect(queue.scheduled).toBe(undefined)
        sandbox.restore()
        done()
      }
    })
    var i = -1
    var n = events.length
    while (++i < n) {
      fakeTimer.tick(interval)
    }
  })
  it('should create an observable emitting periodically with the AnimationFrameScheduler', function (done) {
    var sandbox = sinon.sandbox.create()
    var fakeTimer = sandbox.useFakeTimers()
    var interval = 10
    var events = [0, 1, 2, 3, 4, 5]
    var source = Observable.interval(interval, animationFrame).take(6)
    source.subscribe({
      next: function (x) {
        expect(x).toBe(events.shift())
      },
      error: function (e) {
        sandbox.restore()
        done(e)
      },
      complete: function () {
        expect(animationFrame.actions.length).toBe(0)
        expect(animationFrame.scheduled).toBe(undefined)
        sandbox.restore()
        done()
      }
    })
    var i = -1
    var n = events.length
    while (++i < n) {
      fakeTimer.tick(interval)
    }
  })
})
