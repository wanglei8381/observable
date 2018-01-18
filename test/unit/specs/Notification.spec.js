/* eslint-disable no-throw-literal */
import * as Rx from '@'
var Notification = Rx.Notification
describe('Notification', function () {
  it('should exist', function () {
    expect(Notification).not.toBeUndefined()
    expect(Notification).toBeType('function')
  })
  it('should not allow convert to observable if given kind is unknown', function () {
    var n = new Notification('x')
    expect(function () {
      return n.toObservable()
    }).toThrow('unexpected notification kind value')
  })
  describe('createNext', function () {
    it('should return a Notification', function () {
      var n = Notification.createNext('test')
      expect(n instanceof Notification).toBeTruthy()
      expect(n.value).toBe('test')
      expect(n.kind).toBe('N')
      expect(n.error).toBeType('undefined')
      expect(n.hasValue).toBeTruthy()
    })
  })
  describe('createError', function () {
    it('should return a Notification', function () {
      var n = Notification.createError('test')
      expect(n instanceof Notification).toBeTruthy()
      expect(n.value).toBeType('undefined')
      expect(n.kind).toBe('E')
      expect(n.error).toBe('test')
      expect(n.hasValue).toBeFalsy()
    })
  })
  describe('createComplete', function () {
    it('should return a Notification', function () {
      var n = Notification.createComplete()
      expect(n instanceof Notification).toBeTruthy()
      expect(n.value).toBeType('undefined')
      expect(n.kind).toBe('C')
      expect(n.error).toBeType('undefined')
      expect(n.hasValue).toBeFalsy()
    })
  })
  describe('toObservable', function () {
    it('should create observable from a next Notification', function () {
      var value = 'a'
      var next = Notification.createNext(value)
      expectObservable(next.toObservable()).toBe('(a|)')
    })
    it('should create observable from a complete Notification', function () {
      var complete = Notification.createComplete()
      expectObservable(complete.toObservable()).toBe('|')
    })
    it('should create observable from a error Notification', function () {
      var error = Notification.createError('error')
      expectObservable(error.toObservable()).toBe('#')
    })
  })
  describe('static reference', function () {
    it('should create new next Notification with value', function () {
      var value = 'a'
      var first = Notification.createNext(value)
      var second = Notification.createNext(value)
      expect(first).not.toBe(second)
    })
    it('should create new error Notification', function () {
      var first = Notification.createError()
      var second = Notification.createError()
      expect(first).not.toBe(second)
    })
    it('should return static next Notification reference without value', function () {
      var first = Notification.createNext(undefined)
      var second = Notification.createNext(undefined)
      expect(first).toBe(second)
    })
    it('should return static complete Notification reference', function () {
      var first = Notification.createComplete()
      var second = Notification.createComplete()
      expect(first).toBe(second)
    })
  })
  describe('do', function () {
    it('should invoke on next', function () {
      var n = Notification.createNext('a')
      var invoked = false
      n.do(
        function () {
          invoked = true
        },
        function () {
          throw 'should not be called'
        },
        function () {
          throw 'should not be called'
        }
      )
      expect(invoked).toBeTruthy()
    })
    it('should invoke on error', function () {
      var n = Notification.createError()
      var invoked = false
      n.do(
        function () {
          throw 'should not be called'
        },
        function () {
          invoked = true
        },
        function () {
          throw 'should not be called'
        }
      )
      expect(invoked).toBeTruthy()
    })
    it('should invoke on complete', function () {
      var n = Notification.createComplete()
      var invoked = false
      n.do(
        function () {
          throw 'should not be called'
        },
        function () {
          throw 'should not be called'
        },
        function () {
          invoked = true
        }
      )
      expect(invoked).toBeTruthy()
    })
  })
  describe('accept', function () {
    it('should accept observer for next Notification', function () {
      var value = 'a'
      var observed = false
      var n = Notification.createNext(value)
      var observer = Rx.Subscriber.create(
        function (x) {
          expect(x).toBe(value)
          observed = true
        },
        function () {
          throw 'should not be called'
        },
        function () {
          throw 'should not be called'
        }
      )
      n.accept(observer)
      expect(observed).toBeTruthy()
    })
    it('should accept observer for error Notification', function () {
      var observed = false
      var n = Notification.createError()
      var observer = Rx.Subscriber.create(
        function () {
          throw 'should not be called'
        },
        function () {
          observed = true
        },
        function () {
          throw 'should not be called'
        }
      )
      n.accept(observer)
      expect(observed).toBeTruthy()
    })
    it('should accept observer for complete Notification', function () {
      var observed = false
      var n = Notification.createComplete()
      var observer = Rx.Subscriber.create(
        function () {
          throw 'should not be called'
        },
        function () {
          throw 'should not be called'
        },
        function () {
          observed = true
        }
      )
      n.accept(observer)
      expect(observed).toBeTruthy()
    })
    it('should accept function for next Notification', function () {
      var value = 'a'
      var observed = false
      var n = Notification.createNext(value)
      n.accept(
        function (x) {
          expect(x).toBe(value)
          observed = true
        },
        function () {
          throw 'should not be called'
        },
        function () {
          throw 'should not be called'
        }
      )
      expect(observed).toBeTruthy()
    })
    it('should accept function for error Notification', function () {
      var observed = false
      var error = 'error'
      var n = Notification.createError(error)
      n.accept(
        function () {
          throw 'should not be called'
        },
        function (err) {
          expect(err).toBe(error)
          observed = true
        },
        function () {
          throw 'should not be called'
        }
      )
      expect(observed).toBeTruthy()
    })
    it('should accept function for complete Notification', function () {
      var observed = false
      var n = Notification.createComplete()
      n.accept(
        function () {
          throw 'should not be called'
        },
        function () {
          throw 'should not be called'
        },
        function () {
          observed = true
        }
      )
      expect(observed).toBeTruthy()
    })
  })
  describe('observe', function () {
    it('should observe for next Notification', function () {
      var value = 'a'
      var observed = false
      var n = Notification.createNext(value)
      var observer = Rx.Subscriber.create(
        function (x) {
          expect(x).toBe(value)
          observed = true
        },
        function () {
          throw 'should not be called'
        },
        function () {
          throw 'should not be called'
        }
      )
      n.observe(observer)
      expect(observed).toBeTruthy()
    })
    it('should observe for error Notification', function () {
      var observed = false
      var n = Notification.createError()
      var observer = Rx.Subscriber.create(
        function () {
          throw 'should not be called'
        },
        function () {
          observed = true
        },
        function () {
          throw 'should not be called'
        }
      )
      n.observe(observer)
      expect(observed).toBeTruthy()
    })
    it('should observe for complete Notification', function () {
      var observed = false
      var n = Notification.createComplete()
      var observer = Rx.Subscriber.create(
        function () {
          throw 'should not be called'
        },
        function () {
          throw 'should not be called'
        },
        function () {
          observed = true
        }
      )
      n.observe(observer)
      expect(observed).toBeTruthy()
    })
  })
})
