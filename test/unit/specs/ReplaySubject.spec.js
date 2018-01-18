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

describe.skip('ReplaySubject with bufferSize=2', function () {
  it('should replay 2 previous values when subscribed', function () {
    var replaySubject = new ReplaySubject(2)

    function feedNextIntoSubject (x) {
      replaySubject.next(x)
    }

    function feedErrorIntoSubject (err) {
      replaySubject.error(err)
    }

    function feedCompleteIntoSubject () {
      replaySubject.complete()
    }

    var sourceTemplate = '-1-2-3----4------5-6---7--8----9--|'
    var subscriber1 = hot('      (a|)                         ').mergeMapTo(
      replaySubject
    )
    var unsub1 = '                     !             '
    var expected1 = '      (23)4------5-6--             '
    var subscriber2 = hot('            (b|)                   ').mergeMapTo(
      replaySubject
    )
    var unsub2 = '                         !         '
    var expected2 = '            (34)-5-6---7--         '
    var subscriber3 = hot('                           (c|)    ').mergeMapTo(
      replaySubject
    )
    var expected3 = '                           (78)9--|'
    expectObservable(
      hot(sourceTemplate).do(
        feedNextIntoSubject,
        feedErrorIntoSubject,
        feedCompleteIntoSubject
      )
    ).toBe(sourceTemplate)
    expectObservable(subscriber1, unsub1).toBe(expected1)
    expectObservable(subscriber2, unsub2).toBe(expected2)
    expectObservable(subscriber3).toBe(expected3)
  })
})
