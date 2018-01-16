import {
  Observable,
  Subject,
  ObjectUnsubscribedError,
  AnonymousSubject
} from '@'

describe('Subject', () => {
  it('should pump values right on through itself', function (done) {
    var subject = new Subject()
    var expected = ['foo', 'bar']
    subject.subscribe(
      function (x) {
        expect(x).toBe(expected.shift())
      },
      null,
      done
    )
    subject.next('foo')
    subject.next('bar')
    subject.complete()
  })

  it('should pump values to multiple subscribers', function (done) {
    var subject = new Subject()
    var expected = ['foo', 'bar']
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

  it(
    'should handle subscribers that arrive and leave at different times, ' +
      'subject does not complete',
    function () {
      var subject = new Subject()
      var results1 = []
      var results2 = []
      var results3 = []
      subject.next(1)
      subject.next(2)
      subject.next(3)
      subject.next(4)
      var subscription1 = subject.subscribe(
        function (x) {
          results1.push(x)
        },
        function (e) {
          results1.push('E')
        },
        function () {
          results1.push('C')
        }
      )
      subject.next(5)
      var subscription2 = subject.subscribe(
        function (x) {
          results2.push(x)
        },
        function (e) {
          results2.push('E')
        },
        function () {
          results2.push('C')
        }
      )
      subject.next(6)
      subject.next(7)
      subscription1.unsubscribe()
      subject.next(8)
      subscription2.unsubscribe()
      subject.next(9)
      subject.next(10)
      var subscription3 = subject.subscribe(
        function (x) {
          results3.push(x)
        },
        function (e) {
          results3.push('E')
        },
        function () {
          results3.push('C')
        }
      )
      subject.next(11)
      subscription3.unsubscribe()
      expect(results1).toEqual([5, 6, 7])
      expect(results2).toEqual([6, 7, 8])
      expect(results3).toEqual([11])
    }
  )

  it(
    'should handle subscribers that arrive and leave at different times, ' +
      'subject completes',
    function () {
      var subject = new Subject()
      var results1 = []
      var results2 = []
      var results3 = []
      subject.next(1)
      subject.next(2)
      subject.next(3)
      subject.next(4)
      var subscription1 = subject.subscribe(
        function (x) {
          results1.push(x)
        },
        function (e) {
          results1.push('E')
        },
        function () {
          results1.push('C')
        }
      )
      subject.next(5)
      var subscription2 = subject.subscribe(
        function (x) {
          results2.push(x)
        },
        function (e) {
          results2.push('E')
        },
        function () {
          results2.push('C')
        }
      )
      subject.next(6)
      subject.next(7)
      subscription1.unsubscribe()
      subject.complete()
      subscription2.unsubscribe()
      var subscription3 = subject.subscribe(
        function (x) {
          results3.push(x)
        },
        function (e) {
          results3.push('E')
        },
        function () {
          results3.push('C')
        }
      )
      subscription3.unsubscribe()
      expect(results1).toEqual([5, 6, 7])
      expect(results2).toEqual([6, 7, 'C'])
      expect(results3).toEqual(['C'])
    }
  )

  it(
    'should handle subscribers that arrive and leave at different times, ' +
      'subject terminates with an error',
    function () {
      var subject = new Subject()
      var results1 = []
      var results2 = []
      var results3 = []
      subject.next(1)
      subject.next(2)
      subject.next(3)
      subject.next(4)
      var subscription1 = subject.subscribe(
        function (x) {
          results1.push(x)
        },
        function (e) {
          results1.push('E')
        },
        function () {
          results1.push('C')
        }
      )
      subject.next(5)
      var subscription2 = subject.subscribe(
        function (x) {
          results2.push(x)
        },
        function (e) {
          results2.push('E')
        },
        function () {
          results2.push('C')
        }
      )
      subject.next(6)
      subject.next(7)
      subscription1.unsubscribe()
      subject.error(new Error('err'))
      subscription2.unsubscribe()
      var subscription3 = subject.subscribe(
        function (x) {
          results3.push(x)
        },
        function (e) {
          results3.push('E')
        },
        function () {
          results3.push('C')
        }
      )
      subscription3.unsubscribe()
      expect(results1).toEqual([5, 6, 7])
      expect(results2).toEqual([6, 7, 'E'])
      expect(results3).toEqual(['E'])
    }
  )

  it(
    'should handle subscribers that arrive and leave at different times, ' +
      'subject completes before nexting any value',
    function () {
      var subject = new Subject()
      var results1 = []
      var results2 = []
      var results3 = []
      var subscription1 = subject.subscribe(
        function (x) {
          results1.push(x)
        },
        function (e) {
          results1.push('E')
        },
        function () {
          results1.push('C')
        }
      )
      var subscription2 = subject.subscribe(
        function (x) {
          results2.push(x)
        },
        function (e) {
          results2.push('E')
        },
        function () {
          results2.push('C')
        }
      )
      subscription1.unsubscribe()
      subject.complete()
      subscription2.unsubscribe()
      var subscription3 = subject.subscribe(
        function (x) {
          results3.push(x)
        },
        function (e) {
          results3.push('E')
        },
        function () {
          results3.push('C')
        }
      )
      subscription3.unsubscribe()
      expect(results1).toEqual([])
      expect(results2).toEqual(['C'])
      expect(results3).toEqual(['C'])
    }
  )

  it('should disallow new subscriber once subject has been disposed', function () {
    var subject = new Subject()
    var results1 = []
    var results2 = []
    var results3 = []
    var subscription1 = subject.subscribe(
      function (x) {
        results1.push(x)
      },
      function (e) {
        results1.push('E')
      },
      function () {
        results1.push('C')
      }
    )
    subject.next(1)
    subject.next(2)
    var subscription2 = subject.subscribe(
      function (x) {
        results2.push(x)
      },
      function (e) {
        results2.push('E')
      },
      function () {
        results2.push('C')
      }
    )
    subject.next(3)
    subject.next(4)
    subject.next(5)
    subscription1.unsubscribe()
    subscription2.unsubscribe()
    subject.unsubscribe()
    expect(function () {
      subject.subscribe(
        function (x) {
          results3.push(x)
        },
        function (err) {
          // 这个不应该执行
          expect(false).toEqual('should not throw error: ' + err.toString())
        }
      )
    }).toThrow(ObjectUnsubscribedError)
    expect(results1).toEqual([1, 2, 3, 4, 5])
    expect(results2).toEqual([3, 4, 5])
    expect(results3).toEqual([])
  })

  it('should not allow values to be nexted after it is unsubscribed', function () {
    var subject = new Subject()
    var expected = ['foo']
    subject.subscribe(function (x) {
      expect(x).toEqual(expected.shift())
    })
    subject.next('foo')
    subject.unsubscribe()
    expect(function () {
      return subject.next('bar')
    }).toThrow(ObjectUnsubscribedError)
  })

  it('should clean out unsubscribed subscribers', function () {
    var subject = new Subject()
    var sub1 = subject.subscribe(function (x) {
      // noop
    })
    var sub2 = subject.subscribe(function (x) {
      // noop
    })
    expect(subject.observers.length).toBe(2)
    sub1.unsubscribe()
    expect(subject.observers.length).toBe(1)
    sub2.unsubscribe()
    expect(subject.observers.length).toBe(0)
  })

  it('should have a static create function that works', function () {
    expect(typeof Subject.create).toBe('function')
    var source = Observable.of(1, 2, 3, 4, 5)
    var nexts = []
    var output = []
    var error
    var complete = false
    var outputComplete = false
    var destination = {
      closed: false,
      next: function (x) {
        nexts.push(x)
      },
      error: function (err) {
        error = err
        this.closed = true
      },
      complete: function () {
        complete = true
        this.closed = true
      }
    }
    var sub = Subject.create(destination, source)
    sub.subscribe(
      function (x) {
        output.push(x)
      },
      null,
      function () {
        outputComplete = true
      }
    )
    sub.next('a')
    sub.next('b')
    sub.next('c')
    sub.complete()
    expect(nexts).toEqual(['a', 'b', 'c'])
    expect(complete).toBeTruthy()
    expect(error).toBeUndefined()
    expect(output).toEqual([1, 2, 3, 4, 5])
    expect(outputComplete).toBeTruthy()
  })

  it('should have a static create function that works also to raise errors', function () {
    var source = Observable.of(1, 2, 3, 4, 5)
    var nexts = []
    var output = []
    var error
    var complete = false
    var outputComplete = false
    var destination = {
      closed: false,
      next: function (x) {
        nexts.push(x)
      },
      error: function (err) {
        error = err
        this.closed = true
      },
      complete: function () {
        complete = true
        this.closed = true
      }
    }
    // destination接受sub.next
    // subscribe中的回调接受source
    var sub = Subject.create(destination, source)
    sub.subscribe(
      function (x) {
        output.push(x)
      },
      null,
      function () {
        outputComplete = true
      }
    )
    sub.next('a')
    sub.next('b')
    sub.next('c')
    sub.error('boom')
    expect(nexts).toEqual(['a', 'b', 'c'])
    expect(complete).toBeFalsy()
    expect(error).toBe('boom')
    expect(output).toEqual([1, 2, 3, 4, 5])
    expect(outputComplete).toBeTruthy()
  })

  it('should be an Observer which can be given to Observable.subscribe', function (done) {
    var source = Observable.of(1, 2, 3, 4, 5)
    var subject = new Subject()
    var expected = [1, 2, 3, 4, 5]
    subject.subscribe(
      function (x) {
        expect(x).toBe(expected.shift())
      },
      function (x) {
        done(new Error('should not be called'))
      },
      function () {
        done()
      }
    )
    source.subscribe(subject)
  })

  it('should be usable as an Observer of a finite delayed Observable', function (done) {
    var source = Observable.of(1, 2, 3).delay(50)
    var subject = new Subject()
    var expected = [1, 2, 3]
    subject.subscribe(
      function (x) {
        expect(x).toBe(expected.shift())
      },
      function (x) {
        done(new Error('should not be called'))
      },
      function () {
        done()
      }
    )
    source.subscribe(subject)
  })

  it('should throw ObjectUnsubscribedError when emit after unsubscribed', function () {
    var subject = new Subject()
    subject.unsubscribe()
    expect(function () {
      subject.next('a')
    }).toThrow(ObjectUnsubscribedError)
    expect(function () {
      subject.error('a')
    }).toThrow(ObjectUnsubscribedError)
    expect(function () {
      subject.complete()
    }).toThrow(ObjectUnsubscribedError)
  })

  it('should not next after completed', function () {
    var subject = new Subject()
    var results = []
    subject.subscribe(
      function (x) {
        return results.push(x)
      },
      null,
      function () {
        return results.push('C')
      }
    )
    subject.next('a')
    subject.complete()
    subject.next('b')
    expect(results).toEqual(['a', 'C'])
  })

  it('should not next after error', function () {
    var error = new Error('wut?')
    var subject = new Subject()
    var results = []
    subject.subscribe(
      function (x) {
        return results.push(x)
      },
      function (err) {
        return results.push(err)
      }
    )
    subject.next('a')
    subject.error(error)
    subject.next('b')
    expect(results).toEqual(['a', error])
  })
})

describe('AnonymousSubject', function () {
  it('should be exposed', function () {
    expect(typeof AnonymousSubject).toBe('function')
  })
  it('should not eager', function () {
    var subscribed = false
    var subject = Subject.create(
      null,
      new Observable(function (observer) {
        subscribed = true
        var subscription = Observable.of('x').subscribe(observer)
        return function () {
          subscription.unsubscribe()
        }
      })
    )
    var observable = subject.asObservable()
    expect(subscribed).toBeFalsy()
    observable.subscribe()
    expect(subscribed).toBeTruthy()
  })
})
