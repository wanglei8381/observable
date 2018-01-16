import * as Rx from '@'
var AsyncSubject = Rx.AsyncSubject
var TestObserver = (function () {
  function TestObserver () {
    this.results = []
  }

  TestObserver.prototype.next = function (value) {
    this.results.push(value)
  }
  TestObserver.prototype.error = function (err) {
    this.results.push(err)
  }
  TestObserver.prototype.complete = function () {
    this.results.push('done')
  }
  return TestObserver
})()
describe('AsyncSubject', () => {
  it('should emit the last value when complete', function () {
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    subject.subscribe(observer)
    subject.next(1)
    expect(observer.results).toEqual([])
    subject.next(2)
    expect(observer.results).toEqual([])
    subject.complete()
    expect(observer.results).toEqual([2, 'done'])
  })
  it('should emit the last value when subscribing after complete', function () {
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    subject.next(1)
    subject.next(2)
    subject.complete()
    subject.subscribe(observer)
    expect(observer.results).toEqual([2, 'done'])
  })
  it('should keep emitting the last value to subsequent subscriptions', function () {
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    var subscription = subject.subscribe(observer)
    subject.next(1)
    expect(observer.results).toEqual([])
    subject.next(2)
    expect(observer.results).toEqual([])
    subject.complete()
    expect(observer.results).toEqual([2, 'done'])
    subscription.unsubscribe()
    observer.results = []
    subject.subscribe(observer)
    expect(observer.results).toEqual([2, 'done'])
  })
  it('should not emit values after complete', function () {
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    subject.subscribe(observer)
    subject.next(1)
    expect(observer.results).toEqual([])
    subject.next(2)
    expect(observer.results).toEqual([])
    subject.complete()
    expect(observer.results).toEqual([2, 'done'])
  })
  it('should not allow change value after complete', function () {
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    var otherObserver = new TestObserver()
    subject.subscribe(observer)
    subject.next(1)
    expect(observer.results).toEqual([])
    subject.complete()
    expect(observer.results).toEqual([1, 'done'])
    subject.next(2)
    subject.subscribe(otherObserver)
    expect(otherObserver.results).toEqual([1, 'done'])
  })
  it('should not emit values if unsubscribed before complete', function () {
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    var subscription = subject.subscribe(observer)
    subject.next(1)
    expect(observer.results).toEqual([])
    subject.next(2)
    expect(observer.results).toEqual([])
    subscription.unsubscribe()
    subject.next(3)
    expect(observer.results).toEqual([])
    subject.complete()
    expect(observer.results).toEqual([])
  })
  it('should just complete if no value has been nexted into it', function () {
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    subject.subscribe(observer)
    expect(observer.results).toEqual([])
    subject.complete()
    expect(observer.results).toEqual(['done'])
  })
  it('should keep emitting complete to subsequent subscriptions', function () {
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    var subscription = subject.subscribe(observer)
    expect(observer.results).toEqual([])
    subject.complete()
    expect(observer.results).toEqual(['done'])
    subscription.unsubscribe()
    observer.results = []
    subject.error(new Error(''))
    subject.subscribe(observer)
    expect(observer.results).toEqual(['done'])
  })
  it('should only error if an error is passed into it', function () {
    var expected = new Error('bad')
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    subject.subscribe(observer)
    subject.next(1)
    expect(observer.results).toEqual([])
    subject.error(expected)
    expect(observer.results).toEqual([expected])
  })
  it('should keep emitting error to subsequent subscriptions', function () {
    var expected = new Error('bad')
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    var subscription = subject.subscribe(observer)
    subject.next(1)
    expect(observer.results).toEqual([])
    subject.error(expected)
    expect(observer.results).toEqual([expected])
    subscription.unsubscribe()
    observer.results = []
    subject.subscribe(observer)
    expect(observer.results).toEqual([expected])
  })
  it('should not allow send complete after error', function () {
    var expected = new Error('bad')
    var subject = new AsyncSubject()
    var observer = new TestObserver()
    var subscription = subject.subscribe(observer)
    subject.next(1)
    expect(observer.results).toEqual([])
    subject.error(expected)
    expect(observer.results).toEqual([expected])
    subscription.unsubscribe()
    observer.results = []
    subject.complete()
    subject.subscribe(observer)
    expect(observer.results).toEqual([expected])
  })
})
