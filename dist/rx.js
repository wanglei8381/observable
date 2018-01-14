(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Rx = {})));
}(this, (function (exports) { 'use strict';

var objectProto = Object.prototype;
var toString = function (obj) { return objectProto.toString.call(obj); };





function isNil (obj) {
  return obj == null
}









function isObject (obj) {
  var type = typeof obj;
  return obj != null && (type === 'object' || type === 'function')
}

function isObjectLike (obj) {
  return obj != null && typeof obj === 'object'
}

/**
 *
 * @param obj {*}
 * @returns {boolean}
 * @example
 * eg1
 * isPlainObject(null) => false
 *
 * eg2
 * isPlainObject([1,2]) => false
 *
 * eg3
 * isPlainObject(Object.create(null)) => true
 *
 * eg4
 * function Foo(){}
 * isPlainObject(new Foo) => false
 */






/**
 *
 * @param value {*}
 * @returns {boolean}
 * @example
 * eg1
 * isLength(1) => true
 *
 * eg2
 * isLength(-1) => false
 *
 * eg3
 * isLength(1.1) => false
 *
 * eg4
 * isLength(1.1) => false
 *
 * eg5
 * isLength(9007199254740992) => false
 *
 */










function isFunction (obj) {
  if (!isObject(obj)) {
    return false
  }

  var tag = toString(obj);
  return tag === '[object Function]' ||
    tag === '[object AsyncFunction]' ||
    tag === '[object GeneratorFunction]' ||
    tag === '[object Proxy]'
}

var Subscription = function Subscription () {
  this._closed = false;
  this.observers = [];
};

var prototypeAccessors = { closed: { configurable: true } };

Subscription.prototype.unsubscribe = function unsubscribe () {
  if (this._unsubscribe) {
    this._unsubscribe();
  }
  this.observers.forEach(function (observer) {
    observer.unsubscribe();
  });
  this.observers = [];
  this._closed = true;
};

Subscription.prototype.add = function add (observer) {
  if (isFunction(observer)) {
    this.observers.push({
      unsubscribe: observer
    });
  } else if (observer instanceof Subscription) {
    this.observers.push(observer);
  }
};

prototypeAccessors.closed.get = function () {
  return this._closed
};

Object.defineProperties( Subscription.prototype, prototypeAccessors );

var Subscriber = (function (Subscription$$1) {
  function Subscriber (next, error, complete) {
    Subscription$$1.call(this);
    if (next) {
      this._next = next;
    }
    if (error) {
      this._error = error;
    }
    if (complete) {
      this._complete = complete;
    }

    this.active = true;
  }

  if ( Subscription$$1 ) Subscriber.__proto__ = Subscription$$1;
  Subscriber.prototype = Object.create( Subscription$$1 && Subscription$$1.prototype );
  Subscriber.prototype.constructor = Subscriber;

  Subscriber.prototype.next = function next (val) {
    if (!this.active) { return }
    if (this._next) {
      try {
        this._next(val);
      } catch (e) {
        this.unsubscribe();
        this.errorSource = 'next';
        this.errorValue = e;
      }
    }
  };

  Subscriber.prototype.error = function error (e) {
    if (!this.active) { return }
    if (this._error) {
      try {
        this._error(e);
      } catch (e) {
        this.unsubscribe();
        this.errorSource = 'error';
        throw e
      }
    } else {
      this.unsubscribe();
      this.errorSource = 'error';
      throw e
    }
    this.unsubscribe();
  };

  Subscriber.prototype.complete = function complete () {
    if (!this.active) { return }
    if (this._complete) {
      this._complete();
    }
    this.unsubscribe();
  };

  Subscriber.prototype.add = function add (observer) {
    if (!this.active) {
      if (isFunction(observer)) {
        observer();
      } else if (observer instanceof Subscription$$1) {
        observer.unsubscribe();
      }
    } else {
      Subscription$$1.prototype.add.call(this, observer);
    }
  };

  Subscriber.prototype._unsubscribe = function _unsubscribe () {
    this.active = false;
  };

  return Subscriber;
}(Subscription));

var emptySubscriber = new Subscriber();

function toSubscriber (observerOrNext, error, complete) {
  var next = observerOrNext;
  if (isNil(observerOrNext)) { return emptySubscriber }
  if (observerOrNext instanceof Subscriber) { return observerOrNext }
  if (isObjectLike(observerOrNext)) {
    next = observerOrNext.next;
    error = observerOrNext.error;
    complete = observerOrNext.complete;
  }
  return new Subscriber(next, error, complete)
}

function getSymbolObservable () {
  var $$observable;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      $$observable = Symbol.observable;
    } else {
      $$observable = Symbol('observable');
      Symbol.observable = $$observable;
    }
  } else {
    $$observable = '@@observable';
  }

  return $$observable
}

var observable = getSymbolObservable();

var Observable = function Observable (subscriber) {
  this._subscriber = subscriber;
};

Observable.prototype.lift = function lift (operator) {
  var observable$$1 = new Observable();
  observable$$1.source = this;
  observable$$1.operator = operator;
  return observable$$1
};

Observable.prototype.subscribe = function subscribe (observerOrNext, error, complete) {
  var observer = toSubscriber(observerOrNext, error, complete);

  if (this.operator) {
    var subscrition = toSubscriber(this.operator(observer));
    observer.add(subscrition);
    this.source.subscribe(subscrition);
  } else if (this._subscriber) {
    observer.add(this._trySubscribe(observer));
  }

  // 当在next中出错时，抛出错误对象
  if (observer.errorValue && observer.errorSource === 'next') {
    throw observer.errorValue
  }

  return observer
};

// 在订阅时出错要通知error，但不会抛出
Observable.prototype._trySubscribe = function _trySubscribe (observer) {
  try {
    return this._subscriber(observer)
  } catch (e) {
    observer.syncError = e;
    observer.error(e);
  }
};

Observable.prototype[observable] = function () {
  return this
};

Observable.create = function create (subscriber) {
  return new Observable(subscriber)
};

Observable.prototype.do = function (nextOrObserver, error, complete) {
  return this.lift(doOperator(nextOrObserver, error, complete))
};

function doOperator (next, error, complete) {
  return function (observer) {
    var subs = {
      next: function next$1 (val) {
        next(val);
        observer.next(val);
      },

      error: function error$1 (e) {
        error && error(e);
        observer.error(e);
      },

      complete: function complete$1 () {
        complete && complete();
        observer.complete();
      }
    };

    return subs
  }
}

exports.Observable = Observable;
exports.Subscription = Subscription;
exports.Subscriber = Subscriber;
exports.emptySubscriber = emptySubscriber;
exports.toSubscriber = toSubscriber;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=rx.js.map
