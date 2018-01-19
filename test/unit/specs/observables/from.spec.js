import { Observable, Scheduler } from '@'

describe('Observable.from', function () {
  it('should throw for non observable object', function () {
    var r = function () {
      Observable.from({}).subscribe()
    }
    expect(r).toThrow()
  })

  it('should return T for ObservableLike objects', function () {
    Observable.from([], Scheduler.asap)
    Observable.from(Observable.empty())
    Observable.from(
      new Promise(function (resolve) {
        return resolve()
      })
    )
  })

  var fakervable = function (...values) {
    return {
      [Symbol.observable] () {
        return {
          subscribe (observer) {
            values.forEach(value => observer.next(value))
            observer.complete()
          }
        }
      }
    }
  }

  var fakerator = function (...values) {
    return {
      [Symbol.iterator] () {
        var clone = values.slice()
        return {
          next: function () {
            return {
              done: clone.length <= 0,
              value: clone.shift()
            }
          }
        }
      }
    }
  }

  var sources = [
    { name: 'observable', value: Observable.of('x') },
    { name: 'observable-like', value: fakervable('x') },
    { name: 'array', value: ['x'] },
    { name: 'promise', value: Promise.resolve('x') },
    { name: 'iterator', value: fakerator('x') },
    {
      name: 'array-like',
      value: {
        0: 'x',
        length: 1
      }
    },
    { name: 'string', value: 'x' },
    {
      name: 'arguments',
      value: (function (x) {
        return arguments
      })('x')
    }
  ]

  var loop = function (source) {
    it('should accept ' + source.name, function (done) {
      var nextInvoked = false
      Observable.from(source.value).subscribe(
        function (x) {
          nextInvoked = true
          expect(x).toBe('x')
        },
        function () {
          done(new Error('should not be called'))
        },
        function () {
          expect(nextInvoked).toBeTruthy()
          done()
        }
      )
    })

    it('should accept ' + source.name + ' and scheduler', function (done) {
      var nextInvoked = false
      Observable.from(source.value, Scheduler.async).subscribe(
        function (x) {
          nextInvoked = true
          expect(x).toBe('x')
        },
        function () {
          done(new Error('should not be called'))
        },
        function () {
          expect(nextInvoked).toBe(true)
          done()
        }
      )
      expect(nextInvoked).toBe(false)
    })
  }

  for (var i = 0; i < sources.length; i++) {
    loop(sources[i])
  }
})
