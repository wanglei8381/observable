import * as Rx from '@'
var ReplaySubject = Rx.ReplaySubject

describe('ReplaySubject', () => {
  it('should extend Subject', function () {
    var subject = new ReplaySubject()
    expect(subject).toBeInstanceOf(Rx.Subject)
  })
  it('should add the observer before running subscription code', function () {
    var subject = new ReplaySubject()
    subject.next(1)
    var results = []
    subject.subscribe(function (value) {
      results.push(value)
      if (value < 3) {
        subject.next(value + 1)
      }
    })
    expect(results).toEqual([1, 2, 3])
  })
  it('should replay values upon subscription', function (done) {
    var subject = new ReplaySubject()
    var expects = [1, 2, 3]
    var i = 0
    subject.next(1)
    subject.next(2)
    subject.next(3)
    subject.subscribe(
      function (x) {
        expect(x).toBe(expects[i++])
        if (i === 3) {
          subject.complete()
        }
      },
      function () {
        done(new Error('should not be called'))
      },
      function () {
        done()
      }
    )
  })
  it('should replay values and complete', function (done) {
    var subject = new ReplaySubject()
    var expects = [1, 2, 3]
    var i = 0
    subject.next(1)
    subject.next(2)
    subject.next(3)
    subject.complete()
    subject.subscribe(
      function (x) {
        expect(x).toBe(expects[i++])
      },
      null,
      done
    )
  })
  it('should replay values and error', function (done) {
    var subject = new ReplaySubject()
    var expects = [1, 2, 3]
    var i = 0
    subject.next(1)
    subject.next(2)
    subject.next(3)
    subject.error('fooey')
    subject.subscribe(
      function (x) {
        expect(x).toBe(expects[i++])
      },
      function (err) {
        expect(err).toBe('fooey')
        done()
      }
    )
  })
  it('should only replay values within its buffer size', function (done) {
    var subject = new ReplaySubject(2)
    var expects = [2, 3]
    var i = 0
    subject.next(1)
    subject.next(2)
    subject.next(3)
    subject.subscribe(
      function (x) {
        expect(x).toBe(expects[i++])
        if (i === 2) {
          subject.complete()
        }
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
