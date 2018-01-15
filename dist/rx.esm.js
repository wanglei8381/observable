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





function isNil(obj) {
  return obj == null;
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










function isFunction(obj) {
  if (!isObject(obj)) {
    return false;
  }

  var tag = toString(obj);
  return tag === '[object Function]' || tag === '[object AsyncFunction]' || tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
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

var Subscription = function () {
  function Subscription() {
    classCallCheck(this, Subscription);

    this._closed = false;
    this.observers = [];
  }

  createClass(Subscription, [{
    key: 'unsubscribe',
    value: function unsubscribe() {
      if (this._unsubscribe) {
        this._unsubscribe();
      }
      this.observers.forEach(function (observer) {
        observer.unsubscribe();
      });
      this.observers = [];
      this._closed = true;
    }
  }, {
    key: 'add',
    value: function add(observer) {
      if (isFunction(observer)) {
        this.observers.push({
          unsubscribe: observer
        });
      } else if (observer instanceof Subscription) {
        this.observers.push(observer);
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

var Subscriber = function (_Subscription) {
  inherits(Subscriber, _Subscription);

  function Subscriber(next, error, complete) {
    classCallCheck(this, Subscriber);

    var _this = possibleConstructorReturn(this, (Subscriber.__proto__ || Object.getPrototypeOf(Subscriber)).call(this));

    if (next) {
      _this._next = next;
    }
    if (error) {
      _this._error = error;
    }
    if (complete) {
      _this._complete = complete;
    }

    _this.active = true;
    return _this;
  }

  createClass(Subscriber, [{
    key: 'next',
    value: function next(val) {
      if (!this.active) return;
      if (this._next) {
        try {
          this._next(val);
        } catch (e) {
          this.unsubscribe();
          this.errorSource = 'next';
          this.errorValue = e;
        }
      }
    }
  }, {
    key: 'error',
    value: function error(e) {
      if (!this.active) return;
      if (this._error) {
        try {
          this._error(e);
        } catch (e) {
          this.unsubscribe();
          this.errorSource = 'error';
          throw e;
        }
      } else {
        this.unsubscribe();
        this.errorSource = 'error';
        throw e;
      }
      this.unsubscribe();
    }
  }, {
    key: 'complete',
    value: function complete() {
      if (!this.active) return;
      if (this._complete) {
        this._complete();
      }
      this.unsubscribe();
    }
  }, {
    key: 'add',
    value: function add(observer) {
      if (!this.active) {
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
    key: '_unsubscribe',
    value: function _unsubscribe() {
      this.active = false;
    }
  }]);
  return Subscriber;
}(Subscription);

var emptySubscriber = new Subscriber();

function toSubscriber(observerOrNext, error, complete) {
  var next = observerOrNext;
  if (isNil(observerOrNext)) return emptySubscriber;
  if (observerOrNext instanceof Subscriber) return observerOrNext;
  if (isObjectLike(observerOrNext)) {
    next = observerOrNext.next;
    error = observerOrNext.error;
    complete = observerOrNext.complete;
  }
  return new Subscriber(next, error, complete);
}

function getSymbolObservable() {
  var $$observable = void 0;

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

  return $$observable;
}

var observable = getSymbolObservable();

var Observable = function () {
  function Observable(subscriber) {
    classCallCheck(this, Observable);

    this._subscriber = subscriber;
  }

  createClass(Observable, [{
    key: 'lift',
    value: function lift(operator) {
      var observable$$1 = new Observable();
      observable$$1.source = this;
      observable$$1.operator = operator;
      return observable$$1;
    }
  }, {
    key: 'subscribe',
    value: function subscribe(observerOrNext, error, complete) {
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
        throw observer.errorValue;
      }

      return observer;
    }

    // 在订阅时出错要通知error，但不会抛出

  }, {
    key: '_trySubscribe',
    value: function _trySubscribe(observer) {
      try {
        return this._subscriber(observer);
      } catch (e) {
        observer.syncError = e;
        observer.error(e);
      }
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

Observable.prototype.do = function (nextOrObserver, error, complete) {
  return this.lift(doOperator(nextOrObserver, error, complete));
};

function doOperator(_next, _error, _complete) {
  return function (observer) {
    var subs = {
      next: function next(val) {
        _next(val);
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

    return subs;
  };
}

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
        this.id = this.recycleAsyncId(this.scheduler, id, null);
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

var Scheduler$1 = function () {
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
Scheduler$1.now = Date.now;

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
}(Scheduler$1);

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

var Scheduler = {
  async: async,
  asap: asap
};

export { Observable, Subscription, Subscriber, emptySubscriber, toSubscriber, Scheduler };
