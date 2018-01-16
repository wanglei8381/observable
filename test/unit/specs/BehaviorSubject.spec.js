import { Subject, BehaviorSubject, ObjectUnsubscribedError } from '@'

describe('BehaviorSubject', () => {
  it('should extend Subject', function () {
    var subject = new BehaviorSubject(null)
    expect(subject).toBeInstanceOf(Subject)
  })

  it('should throw if it has received an error and getValue() is called', function () {
    var subject = new BehaviorSubject(null)
    subject.error(new Error('derp'))
    expect(function () {
      subject.getValue()
    }).toThrow('derp')
  })

  it(
    'should throw an ObjectUnsubscribedError if getValue() is called ' +
      'and the BehaviorSubject has been unsubscribed',
    function () {
      var subject = new BehaviorSubject('hi there')
      subject.unsubscribe()
      expect(function () {
        subject.getValue()
      }).toThrow(ObjectUnsubscribedError)
    }
  )

  it('should have a getValue() method to retrieve the current value', function () {
    var subject = new BehaviorSubject('staltz')
    expect(subject.getValue()).toBe('staltz')
    subject.next('oj')
    expect(subject.getValue()).toBe('oj')
  })

  it('should not allow you to set `value` directly', function () {
    var subject = new BehaviorSubject('flibberty')
    try {
      // XXX: escape from readonly restriction for testing.
      subject.value = 'jibbets'
    } catch (e) {}
    expect(subject.getValue()).toBe('flibberty')
    expect(subject.value).toBe('flibberty')
  })

  it('should still allow you to retrieve the value from the value property', function () {
    var subject = new BehaviorSubject('fuzzy')
    expect(subject.value).toBe('fuzzy')
    subject.next('bunny')
    expect(subject.value).toBe('bunny')
  })

  it('should start with an initialization value', function (done) {
    var subject = new BehaviorSubject('foo')
    var expected = ['foo', 'bar']
    var i = 0
    subject.subscribe(
      function (x) {
        expect(x).toBe(expected[i++])
      },
      null,
      done
    )
    subject.next('bar')
    subject.complete()
  })

  it('should pump values to multiple subscribers', function (done) {
    var subject = new BehaviorSubject('init')
    var expected = ['init', 'foo', 'bar']
    var i = 0
    var j = 0
    subject.subscribe(function (x) {
      expect(x).toBe(expected[i++])
    })
    subject.subscribe(
      function (x) {
        expect(x).toBe(expected[j++])
      },
      null,
      done
    )
    expect(subject.observers.length).toBe(2)
    subject.next('foo')
    subject.next('bar')
    subject.complete()
  })

  it('should not pass values nexted after a complete', function () {
    var subject = new BehaviorSubject('init')
    var results = []
    subject.subscribe(function (x) {
      results.push(x)
    })
    expect(results).toEqual(['init'])
    subject.next('foo')
    expect(results).toEqual(['init', 'foo'])
    subject.complete()
    expect(results).toEqual(['init', 'foo'])
    subject.next('bar')
    expect(results).toEqual(['init', 'foo'])
  })

  it('should clean out unsubscribed subscribers', function (done) {
    var subject = new BehaviorSubject('init')
    var sub1 = subject.subscribe(function (x) {
      expect(x).toBe('init')
    })
    var sub2 = subject.subscribe(function (x) {
      expect(x).toBe('init')
    })
    expect(subject.observers.length).toBe(2)
    sub1.unsubscribe()
    expect(subject.observers.length).toBe(1)
    sub2.unsubscribe()
    expect(subject.observers.length).toBe(0)
    done()
  })
})
