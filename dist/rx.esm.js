var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var objectProto = Object.prototype;
var toString = function toString(obj) {
  return objectProto.toString.call(obj);
};



function isUndefined(obj) {
  return obj === undefined;
}

function isNil(obj) {
  return obj == null;
}

function isString(obj) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  return type === 'string' || obj instanceof String;
}

function isNumber(obj) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  return type === 'number' || obj instanceof Number;
}





function isObject(obj) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  return obj != null && (type === 'object' || type === 'function');
}

function isObjectLike(obj) {
  return obj != null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
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




function isArray(obj) {
  return Array.isArray(obj);
}

// 2^53 - 1 数组下标从0开始，最大长度length - 1
var MAX_SAFE_INTEGER = 9007199254740991;
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
function isLength(value) {
  return typeof value === 'number' && value > -1 && value <= MAX_SAFE_INTEGER && value % 1 === 0;
}

function isArrayLike(obj) {
  return obj !== null && typeof obj !== 'function' && isLength(obj.length);
}







function isFunction(obj) {
  if (!isObject(obj)) {
    return false;
  }

  var tag = toString(obj);
  return tag === '[object Function]' || tag === '[object AsyncFunction]' || tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
}













function isPromise(value) {
  return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}

var id = 0;
var cache = {};
var setImmediate = function setImmediate(cb) {
  id++;
  cache[id] = cb;
  Promise.resolve().then(function () {
    var handle = cache[id];
    if (handle) {
      handle();
    }
  });

  return id;
};

var clearImmediate = function clearImmediate(id) {
  delete cache[id];
};

/* eslint-disable no-undef */
var lastTime = 0;

// 之所以一个一个枚举是因为不能用上下文（微信小程序）
function AnimationFrame() {
  var raf = void 0;
  var caf = void 0;
  if (typeof requestAnimationFrame !== 'undefined') {
    raf = requestAnimationFrame;
    caf = cancelAnimationFrame;
  } else if (typeof webkitRequestAnimationFrame !== 'undefined') {
    raf = webkitRequestAnimationFrame;
    caf = webkitCancelAnimationFrame;
  } else if (typeof msRequestAnimationFrame !== 'undefined') {
    raf = msRequestAnimationFrame;
    caf = msCancelAnimationFrame;
  } else if (typeof mozRequestAnimationFrame !== 'undefined') {
    raf = mozRequestAnimationFrame;
    caf = mozCancelAnimationFrame;
  } else if (typeof oRequestAnimationFrame !== 'undefined') {
    raf = oRequestAnimationFrame;
    caf = oCancelAnimationFrame;
  } else {
    raf = function raf(callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = setTimeout(function () {
        /* eslint-disable standard/no-callback-literal */
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
    caf = clearTimeout;
  }
  return {
    raf: raf,
    caf: caf
  };
}

var _AnimationFrame = AnimationFrame();
var raf = _AnimationFrame.raf;
var caf = _AnimationFrame.caf;

var requestAnimationFrame = raf;
var cancelAnimationFrame = caf;

var ObjectUnsubscribedError = function (_Error) {
  inherits(ObjectUnsubscribedError, _Error);

  function ObjectUnsubscribedError() {
    classCallCheck(this, ObjectUnsubscribedError);

    var _this = possibleConstructorReturn(this, (ObjectUnsubscribedError.__proto__ || Object.getPrototypeOf(ObjectUnsubscribedError)).call(this, 'object unsubscribed'));

    _this.name = 'ObjectUnsubscribedError';
    Object.setPrototypeOf(_this, ObjectUnsubscribedError.prototype);
    return _this;
  }

  return ObjectUnsubscribedError;
}(Error);

var ArgumentOutOfRangeError = function (_Error) {
  inherits(ArgumentOutOfRangeError, _Error);

  function ArgumentOutOfRangeError() {
    classCallCheck(this, ArgumentOutOfRangeError);

    var _this = possibleConstructorReturn(this, (ArgumentOutOfRangeError.__proto__ || Object.getPrototypeOf(ArgumentOutOfRangeError)).call(this, 'argument out of range'));

    _this.name = 'ArgumentOutOfRangeError';
    Object.setPrototypeOf(_this, ArgumentOutOfRangeError.prototype);
    return _this;
  }

  return ArgumentOutOfRangeError;
}(Error);

var Scheduler = function () {
  function Scheduler(SchedulerAction) {
    var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.now;
    classCallCheck(this, Scheduler);

    this.SchedulerAction = SchedulerAction;
    this.now = now;
  }

  // schedule是所有异步的入口，接受三个参数
  // work: 需要执行的任务，delay：延迟多长时间执行，state：交给work的状态
  // 每schedule一次都会生成一个action，action是Scheduler的执行单元


  createClass(Scheduler, [{
    key: "schedule",
    value: function schedule(work) {
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var state = arguments[2];

      return new this.SchedulerAction(this, work).schedule(state, delay);
    }
  }]);
  return Scheduler;
}();
Scheduler.now = Date.now;

var isScheduler = function isScheduler(val) {
  return val != null && val instanceof Scheduler;
};

var _Set = function () {
  function _Set() {
    classCallCheck(this, _Set);

    this.set = Object.create(null);
  }

  createClass(_Set, [{
    key: "add",
    value: function add(key) {
      this.set[key] = true;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      if (this.has(key)) {
        delete this.set[key];
      }
    }
  }, {
    key: "has",
    value: function has(key) {
      return this.set[key] === true;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.set = Object.create(null);
    }
  }]);
  return _Set;
}();

var subscritionActions = ['next', 'error', 'complete'];
function wrapOperator(operator) {
  return function operatorWrapper(observer) {
    var _subscrition = {
      next: function next(value) {
        observer.next(value);
      },
      error: function error(err) {
        observer.error(err);
      },
      complete: function complete() {
        observer.complete();
      }
    };

    var res = operator(observer);
    if (isUndefined(res)) return;
    if (isFunction(res)) {
      _subscrition.next = res;
    } else if (res instanceof Subscriber) {
      _subscrition = res;
    } else if (isObject(res)) {
      for (var i = 0; i < 3; i++) {
        var action = subscritionActions[i];
        if (isFunction(res[action])) {
          _subscrition[action] = res[action];
        }
      }
    }

    var subscrition = toSubscriber(_subscrition);
    observer.add(subscrition);
    this.source.subscribe(subscrition);
  };
}

var uid = 0;
var Subscription = function () {
  function Subscription() {
    classCallCheck(this, Subscription);

    this._closed = false;
    this._uid = uid++;
    this._set = new _Set();
    this.observers = [];
  }

  createClass(Subscription, [{
    key: 'unsubscribe',
    value: function unsubscribe() {
      if (this.closed) return;
      if (this._unsubscribe) {
        this._unsubscribe();
      }
      // _closed要在循环之前赋值，避免相互引用导致的死循环
      this._closed = true;
      var observers = this.observers;
      for (var i = 0; i < observers.length; i++) {
        var observer = observers[i];
        if (observer.closed !== true) {
          observer.unsubscribe();
        }
      }

      this._set.clear();
      this.observers = [];
    }
  }, {
    key: 'add',
    value: function add(observer) {
      // 在asObservable中会把自己加进来，要进行排除，不然在unsubscribe会造成死循环(bug：找了好久)
      if (observer === this) return this;

      if (isFunction(observer)) {
        this._add({
          _uid: uid++,
          unsubscribe: observer
        });
      } else if (observer instanceof Subscription) {
        this._add(observer);
      }
    }
  }, {
    key: '_add',
    value: function _add(observer) {
      var _set = this._set,
          observers = this.observers;

      if (!_set.has(observer._uid)) {
        _set.add(uid);
        observers.push(observer);
      }
    }
  }, {
    key: 'remove',
    value: function remove(observer) {
      var _set = this._set,
          observers = this.observers;

      if (observer && observer._uid && _set.has(observer._uid)) {
        observers.splice(observers.indexOf(observer), 1);
      }
    }
  }, {
    key: 'closed',
    get: function get$$1() {
      return this._closed;
    }
  }]);
  return Subscription;
}();

function getSymbolObservable(key) {
  var $$observable = void 0;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      $$observable = Symbol.observable;
    } else {
      $$observable = Symbol(key);
      Symbol.observable = $$observable;
    }
  } else {
    $$observable = '@@' + key;
  }

  return $$observable;
}

function symbolIteratorPonyfill() {
  if (typeof Symbol === 'function') {
    if (!Symbol.iterator) {
      Symbol.iterator = Symbol('iterator polyfill');
    }
    return Symbol.iterator;
  } else {
    // [for Mozilla Gecko 27-35:](https://mzl.la/2ewE1zC)
    if (typeof Set !== 'undefined' && typeof new Set()['@@iterator'] === 'function') {
      return '@@iterator';
    }
    // required for compatability with es6-shim
    if (typeof Map !== 'undefined') {
      var keys = Object.getOwnPropertyNames(Map.prototype);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        // according to spec, Map.prototype[@@iterator] and Map.orototype.entries must be equal.
        if (key !== 'entries' && key !== 'size' && Map.prototype[key] === Map.prototype['entries']) {
          return key;
        }
      }
    }
    return '@@iterator';
  }
}

var iterator = symbolIteratorPonyfill();

var observable = getSymbolObservable('observable');

var rxSubscriber = getSymbolObservable('rxSubscriber');

var Subscriber = function (_Subscription) {
  inherits(Subscriber, _Subscription);

  function Subscriber(destinationOrNext, error, complete) {
    classCallCheck(this, Subscriber);

    var _this = possibleConstructorReturn(this, (Subscriber.__proto__ || Object.getPrototypeOf(Subscriber)).call(this));

    if (isObjectLike(destinationOrNext)) {
      _this.destination = destinationOrNext;
    } else {
      _this.destination = {
        next: destinationOrNext && destinationOrNext.bind(_this),
        error: error && error.bind(_this),
        complete: complete && complete.bind(_this)
      };
    }

    _this.isStopped = true;
    return _this;
  }

  createClass(Subscriber, [{
    key: 'next',
    value: function next(val) {
      if (!this.isStopped) return;
      try {
        this._next(val);
      } catch (e) {
        this.unsubscribe();
        this.errorSource = 'next';
        this.errorValue = e;
      }
    }
  }, {
    key: 'error',
    value: function error(e) {
      if (!this.isStopped) return;
      try {
        this._error(e);
      } catch (e) {
        this.unsubscribe();
        this.errorSource = 'error';
        throw e;
      }
    }
  }, {
    key: 'complete',
    value: function complete() {
      if (!this.isStopped) return;
      try {
        this._complete();
      } catch (e) {
        this.unsubscribe();
        this.errorSource = 'complete';
        throw e;
      }
    }
  }, {
    key: 'add',
    value: function add(observer) {
      if (!this.isStopped) {
        if (isFunction(observer)) {
          observer();
        } else if (observer instanceof Subscription) {
          observer.unsubscribe();
        }
      } else {
        get(Subscriber.prototype.__proto__ || Object.getPrototypeOf(Subscriber.prototype), 'add', this).call(this, observer);
      }
    }
  }, {
    key: '_next',
    value: function _next(value) {
      if (this.destination.next) {
        this.destination.next(value);
      }
    }
  }, {
    key: '_error',
    value: function _error(e) {
      if (this.destination.error) {
        this.destination.error(e);
      } else {
        this.unsubscribe();
        this.errorSource = 'error';
        throw e;
      }
      this.unsubscribe();
    }
  }, {
    key: '_complete',
    value: function _complete() {
      if (this.destination.complete) {
        this.destination.complete();
      }
      this.unsubscribe();
    }
  }, {
    key: '_unsubscribe',
    value: function _unsubscribe() {
      this.isStopped = false;
    }
  }], [{
    key: 'create',
    value: function create() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(Subscriber, [null].concat(args)))();
    }
  }]);
  return Subscriber;
}(Subscription);

var emptySubscriber = new Subscriber();

function toSubscriber(observerOrNext, error, complete) {
  var next = observerOrNext;
  if (isNil(observerOrNext)) return emptySubscriber;
  if (observerOrNext instanceof Subscriber) return observerOrNext;
  if (observerOrNext[rxSubscriber]) {
    next = observerOrNext[rxSubscriber]();
  }
  return new Subscriber(next, error, complete);
}

var Observable = function () {
  function Observable(subscribe) {
    classCallCheck(this, Observable);

    if (subscribe) {
      this._subscribe = subscribe;
    }
    // 是否只触发一次数据
    this._isScalar = false;
  }

  createClass(Observable, [{
    key: 'lift',
    value: function lift(operator) {
      var observable$$1 = new Observable();
      observable$$1.source = this;
      observable$$1.operator = wrapOperator(operator);
      return observable$$1;
    }
  }, {
    key: 'subscribe',
    value: function subscribe(observerOrNext, error, complete) {
      var observer = toSubscriber(observerOrNext, error, complete);

      if (this.operator) {
        this.operator(observer);
      } else if (this._subscribe) {
        // 存在source，source当最数据源（如subject中的asObservable）
        observer.add(this.source ? this._subscribe(observer) : this._trySubscribe(observer));
      }

      // 当在next中出错时，抛出错误对象
      if (observer.errorValue && observer.errorSource === 'next') {
        throw observer.errorValue;
      }

      return observer;
    }

    // 在订阅时出错要通知error，但不会抛出

  }, {
    key: '_trySubscribe',
    value: function _trySubscribe(observer) {
      try {
        return this._subscribe(observer);
      } catch (e) {
        observer.syncError = e;
        observer.error(e);
      }
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(observer) {
      return this.source.subscribe(observer);
    }
  }, {
    key: observable,
    value: function value() {
      return this;
    }
  }], [{
    key: 'create',
    value: function create(subscriber) {
      return new Observable(subscriber);
    }
  }]);
  return Observable;
}();

var ArrayObservable = function (_Observable) {
  inherits(ArrayObservable, _Observable);

  function ArrayObservable(array, scheduler) {
    classCallCheck(this, ArrayObservable);

    var _this = possibleConstructorReturn(this, (ArrayObservable.__proto__ || Object.getPrototypeOf(ArrayObservable)).call(this));

    _this.array = array;
    _this.scheduler = scheduler;
    return _this;
  }

  createClass(ArrayObservable, [{
    key: '_subscribe',
    value: function _subscribe(observer) {
      var array = this.array,
          scheduler = this.scheduler;

      var len = array.length;
      if (scheduler) {
        scheduler.schedule(ArrayObservable.dispatch, 0, {
          array: array,
          observer: observer,
          index: 0,
          count: len
        });
      } else {
        for (var i = 0; i < len; i++) {
          observer.next(array[i]);
        }
        observer.complete();
      }
    }
  }], [{
    key: 'create',
    value: function create(array, scheduler) {
      return new ArrayObservable(array, scheduler);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(state) {
      var observer = state.observer,
          index = state.index,
          array = state.array,
          count = state.count;
      // 数据发送完毕

      if (index >= count) {
        observer.complete();
        return;
      }
      // 在observer关闭以后也可以发送
      observer.next(array[index]);
      if (observer.closed) return;
      state.index = index + 1;
      // 继续调用后续数据, this会绑定到scheduler的action上
      this.schedule(state);
    }
  }]);
  return ArrayObservable;
}(Observable);

var EmptyObservable = function (_Observable) {
  inherits(EmptyObservable, _Observable);

  function EmptyObservable(scheduler) {
    classCallCheck(this, EmptyObservable);

    var _this = possibleConstructorReturn(this, (EmptyObservable.__proto__ || Object.getPrototypeOf(EmptyObservable)).call(this));

    _this.scheduler = scheduler;
    return _this;
  }

  createClass(EmptyObservable, [{
    key: '_subscribe',
    value: function _subscribe(observer) {
      var scheduler = this.scheduler;

      if (scheduler) {
        return scheduler.schedule(EmptyObservable.dispatch, 0, { observer: observer });
      } else {
        observer.complete();
      }
    }
  }], [{
    key: 'create',
    value: function create(scheduler) {
      return new EmptyObservable(scheduler);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(_ref) {
      var observer = _ref.observer;

      observer.complete();
    }
  }]);
  return EmptyObservable;
}(Observable);

var ScalarObservable = function (_Observable) {
  inherits(ScalarObservable, _Observable);

  function ScalarObservable(value, scheduler) {
    classCallCheck(this, ScalarObservable);

    var _this = possibleConstructorReturn(this, (ScalarObservable.__proto__ || Object.getPrototypeOf(ScalarObservable)).call(this));

    _this.value = value;
    _this.scheduler = scheduler;
    return _this;
  }

  createClass(ScalarObservable, [{
    key: '_subscribe',
    value: function _subscribe(observer) {
      var value = this.value,
          scheduler = this.scheduler;

      if (scheduler) {
        scheduler.schedule(ScalarObservable.dispatch, 0, {
          observer: observer,
          value: value
        });
      } else {
        observer.next(value);
        observer.complete();
      }
    }
  }], [{
    key: 'create',
    value: function create(array, scheduler) {
      return new ScalarObservable(array, scheduler);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(state) {
      var observer = state.observer,
          value = state.value;

      observer.next(value);
      observer.complete();
    }
  }]);
  return ScalarObservable;
}(Observable);

var of = function of() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var scheduler = args[args.length - 1];
  if (isScheduler(scheduler)) {
    args.pop();
  } else {
    scheduler = null;
  }
  var length = args.length;
  if (length === 1) {
    return new ScalarObservable(args[0], scheduler);
  } else if (length > 1) {
    return new ArrayObservable(args, scheduler);
  }
  return new EmptyObservable(scheduler);
};

var empty = EmptyObservable.create;

var ErrorObservable = function (_Observable) {
  inherits(ErrorObservable, _Observable);

  function ErrorObservable(error, scheduler) {
    classCallCheck(this, ErrorObservable);

    var _this = possibleConstructorReturn(this, (ErrorObservable.__proto__ || Object.getPrototypeOf(ErrorObservable)).call(this));

    _this.error = error;
    _this.scheduler = scheduler;
    return _this;
  }

  createClass(ErrorObservable, [{
    key: '_subscribe',
    value: function _subscribe(observer) {
      var scheduler = this.scheduler;
      var error = this.error;
      if (scheduler) {
        return scheduler.schedule(ErrorObservable.dispatch, 0, {
          observer: observer,
          error: error
        });
      } else {
        observer.error(error);
      }
    }
  }], [{
    key: 'create',
    value: function create(scheduler) {
      return new ErrorObservable(scheduler);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(_ref) {
      var observer = _ref.observer,
          error = _ref.error;

      observer.error(error);
    }
  }]);
  return ErrorObservable;
}(Observable);

var throwObservable = ErrorObservable.create;

var PromiseObservable = function (_Observable) {
  inherits(PromiseObservable, _Observable);

  function PromiseObservable(promise, scheduler) {
    classCallCheck(this, PromiseObservable);

    var _this = possibleConstructorReturn(this, (PromiseObservable.__proto__ || Object.getPrototypeOf(PromiseObservable)).call(this));

    _this.promise = promise;
    _this.scheduler = scheduler;
    return _this;
  }

  createClass(PromiseObservable, [{
    key: '_subscribe',
    value: function _subscribe(observer) {
      var _this2 = this;

      var promise = this.promise,
          scheduler = this.scheduler;

      if (scheduler) {
        if (this._isScalar) {
          scheduler.schedule(PromiseObservable.dispatch, 0, {
            observer: observer,
            value: this.value
          });
        } else {
          promise.then(function (value) {
            _this2._isScalar = true;
            _this2.value = value;
            scheduler.schedule(PromiseObservable.dispatch, 0, {
              observer: observer,
              value: value
            });
          }, function (error) {
            scheduler.schedule(function (_ref) {
              var observer = _ref.observer,
                  error = _ref.error;

              observer.error(error);
            }, 0, { observer: observer, error: error });
          }).catch(function (e) {
            // escape the promise trap, throw unhandled errors
            setTimeout(function () {
              throw e;
            });
          });
        }
      } else {
        // 已经执行过
        if (this._isScalar) {
          observer.next(this.value);
          observer.complete();
        } else {
          promise.then(function (value) {
            _this2._isScalar = true;
            _this2.value = value;
            observer.next(value);
            observer.complete();
          }, function (e) {
            observer.error(e);
          }).catch(function (e) {
            // escape the promise trap, throw unhandled errors
            setTimeout(function () {
              throw e;
            });
          });
        }
      }
    }
  }], [{
    key: 'create',
    value: function create(promise, scheduler) {
      return new PromiseObservable(promise, scheduler);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(_ref2) {
      var observer = _ref2.observer,
          value = _ref2.value;

      observer.next(value);
      observer.complete();
    }
  }]);
  return PromiseObservable;
}(Observable);

var fromPromise = PromiseObservable.create;

var ArrayLikeObservable = function (_Observable) {
  inherits(ArrayLikeObservable, _Observable);

  function ArrayLikeObservable(array, scheduler) {
    classCallCheck(this, ArrayLikeObservable);

    var _this = possibleConstructorReturn(this, (ArrayLikeObservable.__proto__ || Object.getPrototypeOf(ArrayLikeObservable)).call(this));

    _this.array = array;
    _this.scheduler = scheduler;
    return _this;
  }

  createClass(ArrayLikeObservable, [{
    key: '_subscribe',
    value: function _subscribe(observer) {
      var array = this.array,
          scheduler = this.scheduler;

      var len = array.length;
      if (scheduler) {
        scheduler.schedule(ArrayLikeObservable.dispatch, 0, {
          array: array,
          observer: observer,
          index: 0,
          count: len
        });
      } else {
        for (var i = 0; i < len; i++) {
          observer.next(array[i]);
        }
        observer.complete();
      }
    }
  }], [{
    key: 'create',
    value: function create(array, scheduler) {
      var length = array.length;
      if (length === 0) {
        return new EmptyObservable(scheduler);
      }

      if (length === 1) {
        return new ScalarObservable(array[0], scheduler);
      }

      return new ArrayLikeObservable(array, scheduler);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(state) {
      var observer = state.observer,
          index = state.index,
          array = state.array,
          count = state.count;
      // 数据发送完毕

      if (index >= count) {
        observer.complete();
        return;
      }
      // 在observer关闭以后也可以发送
      observer.next(array[index]);
      if (observer.closed) return;
      state.index = index + 1;
      // 继续调用后续数据, this会绑定到scheduler的action上
      this.schedule(state);
    }
  }]);
  return ArrayLikeObservable;
}(Observable);

var IteratorObservable = function (_Observable) {
  inherits(IteratorObservable, _Observable);

  function IteratorObservable(iteratorObject, scheduler) {
    classCallCheck(this, IteratorObservable);

    var _this = possibleConstructorReturn(this, (IteratorObservable.__proto__ || Object.getPrototypeOf(IteratorObservable)).call(this));

    if (iteratorObject == null) {
      throw new Error('iterator cannot be null.');
    } else if (!iteratorObject[iterator]) {
      throw new TypeError('object is not iterable');
    }
    _this.iteratorObject = iteratorObject;
    _this.scheduler = scheduler;
    return _this;
  }

  createClass(IteratorObservable, [{
    key: '_subscribe',
    value: function _subscribe(observer) {
      var iteratorObject = this.iteratorObject,
          scheduler = this.scheduler;

      var iterator$$1 = getIterator(iteratorObject);
      if (scheduler) {
        return scheduler.schedule(IteratorObservable.dispatch, 0, {
          observer: observer,
          iterator: iterator$$1,
          index: 0
        });
      } else {
        do {
          var res = iterator$$1.next();
          if (res.done) {
            observer.complete();
            break;
          } else {
            observer.next(res.value);
          }
          // 不理解
          if (observer.closed) {
            if (typeof iterator$$1.return === 'function') {
              iterator$$1.return();
            }
            break;
          }
        } while (true);
      }
    }
  }], [{
    key: 'create',
    value: function create(iterator$$1, scheduler) {
      return new IteratorObservable(iterator$$1, scheduler);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(state) {
      var observer = state.observer,
          iterator$$1 = state.iterator,
          index = state.index;
      // if (hasError) {
      //   observer.error(error)
      //   return
      // }

      var result = iterator$$1.next();
      if (result.done) {
        observer.complete();
        return;
      }

      observer.next(result.value);
      state.index = index + 1;

      if (observer.closed) {
        if (typeof iterator$$1.return === 'function') {
          iterator$$1.return();
        }
        return;
      }

      this.schedule(state);
    }
  }]);
  return IteratorObservable;
}(Observable);

var StringIterator = function () {
  function StringIterator(str) {
    var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : str.length;
    classCallCheck(this, StringIterator);

    this.str = str;
    this.idx = idx;
    this.len = len;
  }

  createClass(StringIterator, [{
    key: 'next',
    value: function next() {
      return this.idx < this.len ? { done: false, value: this.str.charAt(this.idx++) } : { done: true, value: undefined };
    }
  }, {
    key: iterator,
    value: function value() {
      return this;
    }
  }]);
  return StringIterator;
}();

var ArrayIterator = function () {
  function ArrayIterator(array) {
    var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
    classCallCheck(this, ArrayIterator);

    this.array = array;
    this.idx = idx;
    this.len = len;
  }

  createClass(ArrayIterator, [{
    key: 'next',
    value: function next() {
      return this.idx < this.len ? { done: false, value: this.array[this.idx++] } : { done: true, value: undefined };
    }
  }, {
    key: iterator,
    value: function value() {
      return this;
    }
  }]);
  return ArrayIterator;
}();

function getIterator(obj) {
  var i = obj[iterator];
  if (!i && typeof obj === 'string') {
    return new StringIterator(obj);
  }
  if (!i && obj.length !== undefined) {
    return new ArrayIterator(obj);
  }
  if (!i) {
    throw new TypeError('object is not iterable');
  }
  return obj[iterator]();
}

var Notification = function () {
  function Notification(kind, value, error) {
    classCallCheck(this, Notification);

    this.kind = kind;
    this.value = value;
    this.error = error;
    this.hasValue = kind === 'N';
  }

  createClass(Notification, [{
    key: 'observe',
    value: function observe(observer) {
      switch (this.kind) {
        case 'N':
          return observer.next && observer.next(this.value);
        case 'E':
          return observer.error && observer.error(this.error);
        case 'C':
          return observer.complete && observer.complete();
      }
    }
  }, {
    key: 'do',
    value: function _do(next, error, complete) {
      this.observe({
        next: next,
        error: error,
        complete: complete
      });
    }
  }, {
    key: 'accept',
    value: function accept(nextOrObserver, error, complete) {
      if (isObjectLike(nextOrObserver)) {
        this.observe(nextOrObserver);
      } else {
        this.do(nextOrObserver, error, complete);
      }
    }
  }, {
    key: 'toObservable',
    value: function toObservable() {
      var kind = this.kind;
      switch (kind) {
        case 'N':
          return Observable.of(this.value);
        case 'E':
          return Observable.throw(this.error);
        case 'C':
          return Observable.empty();
      }
      throw new Error('unexpected notification kind value');
    }
  }], [{
    key: 'createNext',
    value: function createNext(value) {
      return isUndefined(value) ? Notification.undefinedValueNotification : new Notification('N', value);
    }
  }, {
    key: 'createError',
    value: function createError(e) {
      return new Notification('E', undefined, e);
    }
  }, {
    key: 'createComplete',
    value: function createComplete() {
      return Notification.completeNotification;
    }
  }]);
  return Notification;
}();
Notification.completeNotification = new Notification('C');
Notification.undefinedValueNotification = new Notification('N', undefined);

var ObserveOnSubscriber = function (_Subscriber) {
  inherits(ObserveOnSubscriber, _Subscriber);

  function ObserveOnSubscriber(destination, scheduler) {
    var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    classCallCheck(this, ObserveOnSubscriber);

    var _this = possibleConstructorReturn(this, (ObserveOnSubscriber.__proto__ || Object.getPrototypeOf(ObserveOnSubscriber)).call(this, destination));

    _this.scheduler = scheduler;
    _this.delay = delay;
    return _this;
  }

  createClass(ObserveOnSubscriber, [{
    key: 'scheduleMessage',
    value: function scheduleMessage(notification) {
      this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, {
        notification: notification,
        destination: this.destination
      }));
    }
  }, {
    key: '_next',
    value: function _next(value) {
      this.scheduleMessage(Notification.createNext(value));
    }
  }, {
    key: '_error',
    value: function _error(e) {
      this.scheduleMessage(Notification.createError(e));
    }
  }, {
    key: '_complete',
    value: function _complete() {
      this.scheduleMessage(Notification.createComplete());
    }
  }], [{
    key: 'dispatch',
    value: function dispatch(_ref) {
      var notification = _ref.notification,
          destination = _ref.destination;

      notification.observe(destination);
      // this: scheduler执行中的action
      this.unsubscribe();
    }
  }]);
  return ObserveOnSubscriber;
}(Subscriber);

var FromObservable = function (_Observable) {
  inherits(FromObservable, _Observable);

  function FromObservable(ish, scheduler) {
    classCallCheck(this, FromObservable);

    var _this = possibleConstructorReturn(this, (FromObservable.__proto__ || Object.getPrototypeOf(FromObservable)).call(this));

    _this.ish = ish;
    _this.scheduler = scheduler;
    return _this;
  }

  createClass(FromObservable, [{
    key: '_subscribe',
    value: function _subscribe(observer) {
      var ish = this.ish,
          scheduler = this.scheduler;

      if (scheduler == null) {
        return ish[observable]().subscribe(observer);
      } else {
        return ish[observable]().subscribe(new ObserveOnSubscriber(observer, scheduler, 0));
      }
    }
  }], [{
    key: 'create',
    value: function create(ish, scheduler) {
      if (ish != null) {
        if (isFunction(ish[observable])) {
          if (ish instanceof Observable && !scheduler) {
            return ish;
          }
          return new FromObservable(ish, scheduler);
        }

        if (isArray(ish)) {
          return new ArrayObservable(ish, scheduler);
        }

        if (isPromise(ish)) {
          return new PromiseObservable(ish, scheduler);
        }

        if (isFunction(ish[iterator]) || isString(ish)) {
          return new IteratorObservable(ish, scheduler);
        }

        if (isArrayLike(ish)) {
          return ArrayLikeObservable.create(ish, scheduler);
        }
      }
      throw new TypeError((ish !== null && (typeof ish === 'undefined' ? 'undefined' : _typeof(ish)) || ish) + ' is not observable');
    }
  }]);
  return FromObservable;
}(Observable);

var fromObservable = FromObservable.create;

Observable.of = of;

Observable.empty = empty;

Observable.throw = throwObservable;

Observable.fromPromise = fromPromise;

Observable.from = fromObservable;

Observable.range = function (start, end, scheduler) {
  var arr = [];
  for (var i = start; i <= end; i++) {
    arr.push(i);
  }
  return new ArrayObservable(arr, scheduler);
};

var doOperator = function doOperator(_next, _error, _complete) {
  return function (observer) {
    return {
      next: function next(val) {
        _next && _next(val);
        observer.next(val);
      },
      error: function error(e) {
        _error && _error(e);
        observer.error(e);
      },
      complete: function complete() {
        _complete && _complete();
        observer.complete();
      }
    };
  };
};

function delayOperator() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function (observer) {
    var queue = [];
    var count = 0;
    var index = 0;

    function execute() {
      var state = queue.shift();
      if (state.type === 'N') {
        setTimeout(function () {
          index++;
          observer.next(state.value);
          if (count === index && queue.length > 0) {
            execute();
          }
        }, delay);
      } else if (state.type === 'E') {
        observer.error(state.value);
      } else {
        observer.complete();
      }
    }

    return {
      next: function next(value) {
        queue.push({
          type: 'N',
          value: value
        });
        count++;
        execute();
      },
      error: function error(value) {
        queue.push({
          type: 'E',
          value: value
        });
      },
      complete: function complete() {
        queue.push({
          type: 'C'
        });
      }
    };
  };
}

function takeOperator() {
  var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Number.POSITIVE_INFINITY;

  if (number < 0) {
    throw new ArgumentOutOfRangeError();
  }
  return function (observer) {
    var count = 0;
    if (number === 0) {
      return observer.complete();
    }
    return function (val) {
      count++;
      if (count > number) {
        observer.complete();
      } else {
        observer.next(val);
        if (count === number) {
          observer.complete();
        }
      }
    };
  };
}

function filterOperator(predicate, context) {
  var index = 0;
  return function (observer) {
    return function (val) {
      try {
        if (predicate.call(context, val, index++)) {
          observer.next(val);
        }
      } catch (e) {
        observer.error(e);
      }
    };
  };
}

function mapOperator(project, context) {
  if (typeof project !== 'function') {
    throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
  }
  var index = 0;
  return function (observer) {
    return function (val) {
      try {
        observer.next(project.call(context, val, index++));
      } catch (e) {
        observer.error(e);
      }
    };
  };
}

var OuterSubscriber = function (_Subscriber) {
  inherits(OuterSubscriber, _Subscriber);

  function OuterSubscriber() {
    classCallCheck(this, OuterSubscriber);
    return possibleConstructorReturn(this, (OuterSubscriber.__proto__ || Object.getPrototypeOf(OuterSubscriber)).apply(this, arguments));
  }

  createClass(OuterSubscriber, [{
    key: 'notifyNext',
    value: function notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.destination.next(innerValue);
    }
  }, {
    key: 'notifyError',
    value: function notifyError(error, innerSub) {
      this.destination.error(error);
    }
  }, {
    key: 'notifyComplete',
    value: function notifyComplete(innerSub) {
      this.destination.complete();
    }
  }]);
  return OuterSubscriber;
}(Subscriber);

var InnerSubscriber = function (_Subscriber) {
  inherits(InnerSubscriber, _Subscriber);

  function InnerSubscriber(parent, outerValue, outerIndex) {
    classCallCheck(this, InnerSubscriber);

    var _this = possibleConstructorReturn(this, (InnerSubscriber.__proto__ || Object.getPrototypeOf(InnerSubscriber)).call(this));

    _this.parent = parent;
    _this.outerValue = outerValue;
    _this.outerIndex = outerIndex;
    _this.index = 0;
    return _this;
  }

  createClass(InnerSubscriber, [{
    key: '_next',
    value: function _next(value) {
      this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    }
  }, {
    key: '_error',
    value: function _error(error) {
      this.parent.notifyError(error, this);
      this.unsubscribe();
    }
  }, {
    key: '_complete',
    value: function _complete() {
      this.parent.notifyComplete(this);
      this.unsubscribe();
    }
  }]);
  return InnerSubscriber;
}(Subscriber);

function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
  var destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
  if (destination.closed) return null;
  if (result instanceof Observable) {
    if (result._isScalar) {
      destination.next(result.value);
      destination.complete();
      return null;
    } else {
      return result.subscribe(destination);
    }
  } else if (isArrayLike(result)) {
    for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
      destination.next(result[i]);
    }
    if (!destination.closed) {
      destination.complete();
    }
  } else if (isPromise(result)) {
    result.then(function (value) {
      if (!destination.closed) {
        destination.next(value);
        destination.complete();
      }
    }, function (err) {
      return destination.error(err);
    }).catch(function (err) {
      setTimeout(function () {
        throw err;
      });
    });
    return destination;
  } else if (result && typeof result[iterator] === 'function') {
    var iterator$$1 = result[iterator]();
    do {
      var item = iterator$$1.next();
      if (item.done) {
        destination.complete();
        break;
      }
      destination.next(item.value);
      if (destination.closed) {
        break;
      }
    } while (true);
  } else if (result && typeof result[observable] === 'function') {
    var obs = result[observable]();
    if (typeof obs.subscribe !== 'function') {
      destination.error(new TypeError('Provided object does not correctly implement Symbol.observable'));
    } else {
      return obs.subscribe(new InnerSubscriber(outerSubscriber, outerValue, outerIndex));
    }
  } else {
    var value = isObject(result) ? 'an invalid object' : '\'' + result + '\'';
    var msg = 'You provided ' + value + ' where a stream was expected.' + ' You can provide an Observable, Promise, Array, or Iterable.';
    destination.error(new TypeError(msg));
  }
  return null;
}

function mergeMapOperator(project, resultSelector) {
  var concurrent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.POSITIVE_INFINITY;

  if (isNumber(resultSelector)) {
    concurrent = resultSelector;
    resultSelector = null;
  }
  return function (observer) {
    return new MergeMapSubscriber(observer, project, resultSelector, concurrent);
  };
}

var MergeMapSubscriber = function (_OuterSubscriber) {
  inherits(MergeMapSubscriber, _OuterSubscriber);

  function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
    classCallCheck(this, MergeMapSubscriber);

    var _this = possibleConstructorReturn(this, (MergeMapSubscriber.__proto__ || Object.getPrototypeOf(MergeMapSubscriber)).call(this, destination));

    _this.project = project;
    _this.resultSelector = resultSelector;
    _this.concurrent = concurrent;
    _this.index = 0;
    _this.hasCompleted = false;
    _this.buffer = [];
    _this.active = 0;
    return _this;
  }

  createClass(MergeMapSubscriber, [{
    key: '_next',
    value: function _next(value) {
      if (this.active < this.concurrent) {
        this._tryNext(value);
      } else {
        this.buffer.push(value);
      }
    }
  }, {
    key: '_tryNext',
    value: function _tryNext(value) {
      try {
        var index = this.index++;
        var result = this.project(value, index);
        this.active++;
        this._innerSub(result, value, index);
      } catch (e) {
        get(MergeMapSubscriber.prototype.__proto__ || Object.getPrototypeOf(MergeMapSubscriber.prototype), '_error', this).call(this, e);
      }
    }
  }, {
    key: '_innerSub',
    value: function _innerSub(ish, value, index) {
      this.add(subscribeToResult(this, ish, value, index));
    }
  }, {
    key: '_complete',
    value: function _complete() {
      this.hasCompleted = true;
      // 所有的都结束了
      if (this.active === 0 && this.buffer.length === 0) {
        this.destination.complete();
      }
    }
  }, {
    key: 'notifyNext',
    value: function notifyNext(outerValue, innerValue, outerIndex, innerIndex) {
      if (this.resultSelector) {
        this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
      } else {
        this.destination.next(innerValue);
      }
    }
  }, {
    key: '_notifyResultSelector',
    value: function _notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex) {
      try {
        var result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        this.destination.next(result);
      } catch (err) {
        this.destination.error(err);
      }
    }
  }, {
    key: 'notifyComplete',
    value: function notifyComplete(innerSub) {
      var buffer = this.buffer;
      this.remove(innerSub);
      this.active--;
      if (buffer.length > 0) {
        this._next(buffer.shift());
      } else if (this.active === 0 && this.hasCompleted) {
        this.destination.complete();
      }
    }
  }]);
  return MergeMapSubscriber;
}(OuterSubscriber);

Observable.prototype.do = function (nextOrObserver, error, complete) {
  return this.lift(doOperator(nextOrObserver, error, complete));
};

Observable.prototype.delay = function (nextOrObserver, error, complete) {
  return this.lift(delayOperator(nextOrObserver, error, complete));
};

Observable.prototype.take = function (number) {
  return this.lift(takeOperator(number));
};

Observable.prototype.filter = function (predicate, context) {
  return this.lift(filterOperator(predicate, context));
};

Observable.prototype.map = function (project, context) {
  return this.lift(mapOperator(project, context));
};

Observable.prototype.mergeMap = function (project, resultSelector, concurrent) {
  return this.lift(mergeMapOperator(project, resultSelector, concurrent));
};

var Subject = function (_Observable) {
  inherits(Subject, _Observable);

  function Subject() {
    classCallCheck(this, Subject);

    var _this = possibleConstructorReturn(this, (Subject.__proto__ || Object.getPrototypeOf(Subject)).call(this));

    _this.closed = false;
    _this.isStopped = false;
    _this.observers = [];
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }

  createClass(Subject, [{
    key: 'lift',
    value: function lift(operator) {
      var subject = new AnonymousSubject(this, this);
      subject.operator = wrapOperator(operator);
      return subject;
    }
  }, {
    key: 'next',
    value: function next(state) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
      if (!this.isStopped) {
        iterateObserver(this.observers, 'next', state);
      }
    }
  }, {
    key: 'error',
    value: function error(e) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
      if (!this.isStopped) {
        this.hasError = true;
        this.thrownError = e;
        this.isStopped = true;
        iterateObserver(this.observers, 'error', e);
        this.observers = [];
      }
    }
  }, {
    key: 'complete',
    value: function complete() {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
      if (!this.isStopped) {
        this.isStopped = true;
        iterateObserver(this.observers, 'complete');
        this.observers = [];
      }
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe() {
      this.closed = true;
      this.isStopped = true;
      this.observers = null;
    }
  }, {
    key: '_trySubscribe',
    value: function _trySubscribe(observer) {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      } else {
        return get(Subject.prototype.__proto__ || Object.getPrototypeOf(Subject.prototype), '_trySubscribe', this).call(this, observer);
      }
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(observer) {
      var _this2 = this;

      if (this.hasError) {
        observer.error(this.thrownError);
      } else if (this.isStopped) {
        observer.complete();
      } else {
        this.observers.push(observer);
        // 释放资源
        return function () {
          return subjectSubscription(_this2, observer);
        };
      }
    }
  }, {
    key: 'asObservable',
    value: function asObservable() {
      var observable$$1 = new Observable();
      observable$$1.source = this;
      return observable$$1;
    }
  }, {
    key: rxSubscriber,


    // Subject -> Subscriber
    value: function value() {
      var subject = this;
      return {
        next: function next(val) {
          subject.next(val);
        },
        error: function error(e) {
          subject.error(e);
        },
        complete: function complete() {
          subject.complete();
        }
      };
    }
  }], [{
    key: 'create',
    value: function create(destination, source) {
      return new AnonymousSubject(destination, source);
    }
  }]);
  return Subject;
}(Observable);

var AnonymousSubject = function (_Subject) {
  inherits(AnonymousSubject, _Subject);

  function AnonymousSubject(destination, source) {
    classCallCheck(this, AnonymousSubject);

    var _this3 = possibleConstructorReturn(this, (AnonymousSubject.__proto__ || Object.getPrototypeOf(AnonymousSubject)).call(this));

    _this3.dest = destination;
    _this3.source = source;
    return _this3;
  }

  createClass(AnonymousSubject, [{
    key: 'next',
    value: function next(value) {
      if (this.dest && this.dest.next) {
        this.dest.next(value);
      }
    }
  }, {
    key: 'error',
    value: function error(err) {
      if (this.dest && this.dest.error) {
        this.dest.error(err);
      }
    }
  }, {
    key: 'complete',
    value: function complete() {
      if (this.dest && this.dest.complete) {
        this.dest.complete();
      }
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(observer) {
      if (this.source) {
        return this.source.subscribe(observer);
      }
    }
  }]);
  return AnonymousSubject;
}(Subject);

function iterateObserver(observers, key, val) {
  var len = observers.length;
  var list = observers.slice();
  for (var i = 0; i < len; i++) {
    list[i][key](val);
  }
}

function subjectSubscription(subject, observer) {
  if (subject.observers.length === 0) {
    return;
  }
  var index = subject.observers.indexOf(observer);
  if (index !== -1) {
    subject.observers.splice(index, 1);
  }
}

var BehaviorSubject = function (_Subject) {
  inherits(BehaviorSubject, _Subject);

  function BehaviorSubject(val) {
    classCallCheck(this, BehaviorSubject);

    var _this = possibleConstructorReturn(this, (BehaviorSubject.__proto__ || Object.getPrototypeOf(BehaviorSubject)).call(this));

    _this._value = val;
    return _this;
  }

  createClass(BehaviorSubject, [{
    key: 'next',
    value: function next(val) {
      this._value = val;
      get(BehaviorSubject.prototype.__proto__ || Object.getPrototypeOf(BehaviorSubject.prototype), 'next', this).call(this, val);
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(observer) {
      var res = get(BehaviorSubject.prototype.__proto__ || Object.getPrototypeOf(BehaviorSubject.prototype), '_subscribe', this).call(this, observer);
      if (!observer.closed) {
        observer.next(this._value);
      }
      return res;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      if (this.hasError) {
        throw this.thrownError;
      } else if (this.closed) {
        throw new ObjectUnsubscribedError();
      } else {
        return this._value;
      }
    }
  }, {
    key: 'value',
    get: function get$$1() {
      return this.getValue();
    }
  }]);
  return BehaviorSubject;
}(Subject);

var AsyncSubject = function (_Subject) {
  inherits(AsyncSubject, _Subject);

  function AsyncSubject() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, AsyncSubject);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = AsyncSubject.__proto__ || Object.getPrototypeOf(AsyncSubject)).call.apply(_ref, [this].concat(args))), _this), _this.value = null, _this.hasNext = false, _this.hasCompleted = false, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(AsyncSubject, [{
    key: '_subscribe',
    value: function _subscribe(observer) {
      if (this.hasError) {
        observer.error(this.thrownError);
      } else if (this.hasCompleted && this.hasNext) {
        observer.next(this.value);
        observer.complete();
      }
      return get(AsyncSubject.prototype.__proto__ || Object.getPrototypeOf(AsyncSubject.prototype), '_subscribe', this).call(this, observer);
    }
  }, {
    key: 'next',
    value: function next(value) {
      if (!this.hasCompleted) {
        this.value = value;
        this.hasNext = true;
      }
    }
  }, {
    key: 'error',
    value: function error(_error) {
      if (!this.hasCompleted) {
        get(AsyncSubject.prototype.__proto__ || Object.getPrototypeOf(AsyncSubject.prototype), 'error', this).call(this, _error);
      }
    }
  }, {
    key: 'complete',
    value: function complete() {
      this.hasCompleted = true;
      if (this.hasNext) {
        get(AsyncSubject.prototype.__proto__ || Object.getPrototypeOf(AsyncSubject.prototype), 'next', this).call(this, this.value);
      }
      get(AsyncSubject.prototype.__proto__ || Object.getPrototypeOf(AsyncSubject.prototype), 'complete', this).call(this);
    }
  }]);
  return AsyncSubject;
}(Subject);

var ReplaySubject = function (_Subject) {
  inherits(ReplaySubject, _Subject);

  function ReplaySubject() {
    var bufferSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Number.POSITIVE_INFINITY;
    var windowTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.POSITIVE_INFINITY;
    var scheduler = arguments[2];
    classCallCheck(this, ReplaySubject);

    var _this = possibleConstructorReturn(this, (ReplaySubject.__proto__ || Object.getPrototypeOf(ReplaySubject)).call(this));

    _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
    _this._windowTime = windowTime < 1 ? 1 : windowTime;
    _this.scheduler = scheduler;
    _this._events = [];
    return _this;
  }

  createClass(ReplaySubject, [{
    key: 'next',
    value: function next(value) {
      this._events.push({
        time: this._getNow(),
        value: value
      });
      // 避免数据添加过多
      this._trimBufferThenGetEvents();
      get(ReplaySubject.prototype.__proto__ || Object.getPrototypeOf(ReplaySubject.prototype), 'next', this).call(this, value);
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(observer) {
      var events = this._trimBufferThenGetEvents();
      var scheduler = this.scheduler;
      // 在ReplaySubject中关闭了还订阅会报错
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
      var subscription = void 0;
      if (!this.hasError && !this.isStopped) {
        subscription = get(ReplaySubject.prototype.__proto__ || Object.getPrototypeOf(ReplaySubject.prototype), '_subscribe', this).call(this, observer);
      }

      if (scheduler) {
        observer = new ObserveOnSubscriber(observer, scheduler);
        observer.add(observer);
      }

      var length = events.length;
      for (var i = 0; i < length; i++) {
        observer.next(events[i].value);
      }

      if (this.hasError) {
        observer.error(this.thrownError);
      } else if (this.isStopped) {
        observer.complete();
      }

      return subscription;
    }
  }, {
    key: '_getNow',
    value: function _getNow() {
      return (this.scheduler || Scheduler).now();
    }
  }, {
    key: '_trimBufferThenGetEvents',
    value: function _trimBufferThenGetEvents() {
      var _events = this._events,
          _bufferSize = this._bufferSize,
          _windowTime = this._windowTime;

      var length = _events.length;
      var now = this._getNow();
      var index = 0;
      if (length > _bufferSize) {
        _events.splice(0, length - _bufferSize);
      }

      if (_windowTime === Number.POSITIVE_INFINITY) {
        return _events;
      }

      length = _events.length;
      while (index < length) {
        if (now - _events[index].time < _windowTime) {
          break;
        }
        index++;
      }
      _events.splice(0, index);
      return _events;
    }
  }]);
  return ReplaySubject;
}(Subject);

var Action = function (_Subscription) {
  inherits(Action, _Subscription);

  function Action(scheduler, work) {
    classCallCheck(this, Action);

    var _this = possibleConstructorReturn(this, (Action.__proto__ || Object.getPrototypeOf(Action)).call(this));

    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }

  // 该方法需要在子类中重写


  createClass(Action, [{
    key: 'schedule',
    value: function schedule(state, delay) {
      return this;
    }
  }]);
  return Action;
}(Subscription);

var AsyncAction = function (_Action) {
  inherits(AsyncAction, _Action);

  function AsyncAction() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, AsyncAction);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = AsyncAction.__proto__ || Object.getPrototypeOf(AsyncAction)).call.apply(_ref, [this].concat(args))), _this), _this.id = null, _this.state = undefined, _this.delay = 0, _this.pending = false, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(AsyncAction, [{
    key: 'schedule',
    value: function schedule(state) {
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this.closed) return this;

      this.state = state;
      this.delay = delay;
      this.pending = true;
      var scheduler = this.scheduler,
          id = this.id;

      if (id != null) {
        id = this.recycleAsyncId(scheduler, id, delay);
      }
      if (!id) {
        id = this.requestAsyncId(scheduler, id, delay);
      }
      this.id = id;
      return this;
    }
  }, {
    key: 'recycleAsyncId',
    value: function recycleAsyncId(scheduler, id, delay) {
      if (delay !== null && this.delay === delay && this.pending === false) {
        return id;
      }
      clearInterval(id);
      return undefined;
    }
  }, {
    key: 'requestAsyncId',
    value: function requestAsyncId(scheduler, id, delay) {
      return setInterval(scheduler.flush.bind(scheduler, this), delay);
    }
  }, {
    key: 'execute',
    value: function execute(state) {
      if (this.closed) {
        return new Error('executing a cancelled action');
      }
      this.pending = false;
      var error = this._execute(state);
      if (error) {
        return error;
      } else if (this.pending === false && this.id != null) {
        this.id = this.recycleAsyncId(this.scheduler, this.id, null);
      }
    }
  }, {
    key: '_execute',
    value: function _execute(state) {
      try {
        this.work(state);
      } catch (e) {
        this.unsubscribe();
        return e;
      }
    }
  }, {
    key: '_unsubscribe',
    value: function _unsubscribe() {
      var id = this.id;
      var scheduler = this.scheduler;
      var actions = scheduler.actions;
      var index = actions.indexOf(this);

      this.work = null;
      this.state = null;
      this.pending = false;
      this.scheduler = null;

      if (index !== -1) {
        actions.splice(index, 1);
      }

      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, null);
      }

      this.delay = null;
    }
  }]);
  return AsyncAction;
}(Action);

var AsapAction = function (_AsyncAction) {
  inherits(AsapAction, _AsyncAction);

  function AsapAction() {
    classCallCheck(this, AsapAction);
    return possibleConstructorReturn(this, (AsapAction.__proto__ || Object.getPrototypeOf(AsapAction)).apply(this, arguments));
  }

  createClass(AsapAction, [{
    key: 'requestAsyncId',
    value: function requestAsyncId(scheduler, id) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (delay != null && delay > 0) {
        return get(AsapAction.prototype.__proto__ || Object.getPrototypeOf(AsapAction.prototype), 'requestAsyncId', this).call(this, scheduler, id, delay);
      }
      scheduler.actions.push(this);
      return scheduler.scheduled || (scheduler.scheduled = setImmediate(scheduler.flush.bind(scheduler, null)));
    }
  }, {
    key: 'recycleAsyncId',
    value: function recycleAsyncId(scheduler, id) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
        return get(AsapAction.prototype.__proto__ || Object.getPrototypeOf(AsapAction.prototype), 'recycleAsyncId', this).call(this, scheduler, id, delay);
      }

      if (scheduler.actions.length === 0) {
        clearImmediate(id);
        scheduler.scheduled = undefined;
      }

      return undefined;
    }
  }]);
  return AsapAction;
}(AsyncAction);

var AsyncScheduler = function (_Scheduler) {
  inherits(AsyncScheduler, _Scheduler);

  function AsyncScheduler() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, AsyncScheduler);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = AsyncScheduler.__proto__ || Object.getPrototypeOf(AsyncScheduler)).call.apply(_ref, [this].concat(args))), _this), _this.actions = [], _this.active = false, _this.scheduled = undefined, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(AsyncScheduler, [{
    key: 'flush',
    value: function flush(action) {
      var actions = this.actions;
      // 在schedule中继续调用schedule，如果schedule是同步的（QueueScheduler），只需要添加队列中等待执行即可

      if (this.active) {
        actions.push(action);
        return;
      }
      this.active = true;
      var error = void 0;
      do {
        if (error = action.execute(action.state, action.delay)) {
          break;
        }
      } while (action = actions.shift());
      this.active = false;
      if (error) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }
        throw error;
      }
    }
  }]);
  return AsyncScheduler;
}(Scheduler);

var AsapScheduler = function (_AsyncScheduler) {
  inherits(AsapScheduler, _AsyncScheduler);

  function AsapScheduler() {
    classCallCheck(this, AsapScheduler);
    return possibleConstructorReturn(this, (AsapScheduler.__proto__ || Object.getPrototypeOf(AsapScheduler)).apply(this, arguments));
  }

  createClass(AsapScheduler, [{
    key: 'flush',
    value: function flush(action) {
      this.active = true;
      this.scheduled = undefined;
      var actions = this.actions;
      var error = void 0;
      action = action || actions.shift();
      do {
        if (error = action.execute(action.state, action.delay)) break;
      } while (action = actions.shift());

      this.active = false;

      if (error) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }
        throw error;
      }
    }
  }]);
  return AsapScheduler;
}(AsyncScheduler);

var asap = new AsapScheduler(AsapAction);

var async = new AsyncScheduler(AsyncAction);

var AnimationFrameAction = function (_AsyncAction) {
  inherits(AnimationFrameAction, _AsyncAction);

  function AnimationFrameAction() {
    classCallCheck(this, AnimationFrameAction);
    return possibleConstructorReturn(this, (AnimationFrameAction.__proto__ || Object.getPrototypeOf(AnimationFrameAction)).apply(this, arguments));
  }

  createClass(AnimationFrameAction, [{
    key: 'requestAsyncId',
    value: function requestAsyncId(scheduler, id) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (delay != null && delay > 0) {
        return get(AnimationFrameAction.prototype.__proto__ || Object.getPrototypeOf(AnimationFrameAction.prototype), 'requestAsyncId', this).call(this, scheduler, id, delay);
      }
      scheduler.actions.push(this);
      return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(scheduler.flush.bind(scheduler, null)));
    }
  }, {
    key: 'recycleAsyncId',
    value: function recycleAsyncId(scheduler, id) {
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
        return get(AnimationFrameAction.prototype.__proto__ || Object.getPrototypeOf(AnimationFrameAction.prototype), 'recycleAsyncId', this).call(this, scheduler, id, delay);
      }

      if (scheduler.actions.length === 0) {
        cancelAnimationFrame(id);
        scheduler.scheduled = undefined;
      }

      return undefined;
    }
  }]);
  return AnimationFrameAction;
}(AsyncAction);

var AnimationFrameScheduler = function (_AsyncScheduler) {
  inherits(AnimationFrameScheduler, _AsyncScheduler);

  function AnimationFrameScheduler() {
    classCallCheck(this, AnimationFrameScheduler);
    return possibleConstructorReturn(this, (AnimationFrameScheduler.__proto__ || Object.getPrototypeOf(AnimationFrameScheduler)).apply(this, arguments));
  }

  createClass(AnimationFrameScheduler, [{
    key: 'flush',
    value: function flush(action) {
      this.active = true;
      this.scheduled = undefined;
      var actions = this.actions;
      var error = void 0;
      action = action || actions.shift();
      do {
        if (error = action.execute(action.state, action.delay)) break;
      } while (action = actions.shift());

      this.active = false;

      if (error) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }
        throw error;
      }
    }
  }]);
  return AnimationFrameScheduler;
}(AsyncScheduler);

var animationFrame = new AnimationFrameScheduler(AnimationFrameAction);

var QueueAction = function (_AsyncAction) {
  inherits(QueueAction, _AsyncAction);

  function QueueAction() {
    classCallCheck(this, QueueAction);
    return possibleConstructorReturn(this, (QueueAction.__proto__ || Object.getPrototypeOf(QueueAction)).apply(this, arguments));
  }

  createClass(QueueAction, [{
    key: 'schedule',
    value: function schedule(state) {
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this.closed) return this;
      if (delay > 0) {
        return get(QueueAction.prototype.__proto__ || Object.getPrototypeOf(QueueAction.prototype), 'schedule', this).call(this, state, delay);
      }

      this.state = state;
      this.delay = delay;
      this.scheduler.flush(this);
      return this;
    }
  }, {
    key: 'requestAsyncId',
    value: function requestAsyncId(scheduler, id, delay) {
      if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
        return get(QueueAction.prototype.__proto__ || Object.getPrototypeOf(QueueAction.prototype), 'requestAsyncId', this).call(this, scheduler, id, delay);
      }
      return scheduler.flush(this);
    }
  }]);
  return QueueAction;
}(AsyncAction);

var QueueScheduler = function (_AsyncScheduler) {
  inherits(QueueScheduler, _AsyncScheduler);

  function QueueScheduler() {
    classCallCheck(this, QueueScheduler);
    return possibleConstructorReturn(this, (QueueScheduler.__proto__ || Object.getPrototypeOf(QueueScheduler)).apply(this, arguments));
  }

  return QueueScheduler;
}(AsyncScheduler);

var queue = new QueueScheduler(QueueAction);

var Scheduler$1 = {
  async: async,
  asap: asap,
  animationFrame: animationFrame,
  queue: queue
};

export { Observable, ArgumentOutOfRangeError, ObjectUnsubscribedError, Subscriber, emptySubscriber, toSubscriber, Subscription, Subject, AnonymousSubject, BehaviorSubject, AsyncSubject, ReplaySubject, Scheduler$1 as Scheduler, Notification };
