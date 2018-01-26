import { Observable } from '@'

describe('Observable.defer', function () {
  it('defer(() => Observable.of(a, b, c)) should defer the creation of a simple Observable', function () {
    var expected = '-a--b--c--|'
    var e1 = Observable.defer(function () {
      return cold('-a--b--c--|')
    })
    expectObservable(e1).toBe(expected)
  })
  it('should create an observable from the provided observable factory', function () {
    var source = hot('--a--b--c--|')
    var sourceSubs = '^          !'
    var expected = '--a--b--c--|'
    var e1 = Observable.defer(function () {
      return source
    })
    expectObservable(e1).toBe(expected)
    expectSubscriptions(source.subscriptions).toBe(sourceSubs)
  })
  it('should create an observable from completed', function () {
    var source = hot('|')
    var sourceSubs = '(^!)'
    var expected = '|'
    var e1 = Observable.defer(function () {
      return source
    })
    expectObservable(e1).toBe(expected)
    expectSubscriptions(source.subscriptions).toBe(sourceSubs)
  })
  it('should accept factory returns promise resolves', function (done) {
    var expected = 42
    var e1 = Observable.defer(function () {
      return new Promise(function (resolve) {
        resolve(expected)
      })
    })
    e1.subscribe(
      function (x) {
        expect(x).toBe(expected)
        done()
      },
      function (x) {
        done(new Error('should not be called'))
      }
    )
  })
  it('should accept factory returns promise rejects', function (done) {
    var expected = 42
    var e1 = Observable.defer(function () {
      return new Promise(function (resolve, reject) {
        reject(expected)
      })
    })
    e1.subscribe(
      function () {
        done(new Error('should not be called'))
      },
      function (x) {
        expect(x).toBe(expected)
        done()
      },
      function () {
        done(new Error('should not be called'))
      }
    )
  })
  it('should create an observable from error', function () {
    var source = hot('#')
    var sourceSubs = '(^!)'
    var expected = '#'
    var e1 = Observable.defer(function () {
      return source
    })
    expectObservable(e1).toBe(expected)
    expectSubscriptions(source.subscriptions).toBe(sourceSubs)
  })
  it('should create an observable when factory throws', function () {
    var e1 = Observable.defer(function () {
      throw 'error'
    })
    var expected = '#'
    expectObservable(e1).toBe(expected)
  })
  it('should allow unsubscribing early and explicitly', function () {
    var source = hot('--a--b--c--|')
    var sourceSubs = '^     !     '
    var expected = '--a--b-     '
    var unsub = '      !     '
    var e1 = Observable.defer(function () {
      return source
    })
    expectObservable(e1, unsub).toBe(expected)
    expectSubscriptions(source.subscriptions).toBe(sourceSubs)
  })
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    var source = hot('--a--b--c--|')
    var sourceSubs = '^     !     '
    var expected = '--a--b-     '
    var unsub = '      !     '
    var e1 = Observable.defer(function () {
      return source.mergeMap(function (x) {
        return Observable.of(x)
      })
    }).mergeMap(function (x) {
      return Observable.of(x)
    })
    expectObservable(e1, unsub).toBe(expected)
    expectSubscriptions(source.subscriptions).toBe(sourceSubs)
  })
})
