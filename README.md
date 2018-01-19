# reactivex

### Observable
观察者模式的订阅

> subscribe
通过执行subscribe订阅

### Subscriber
观察者模式的发布

### Scheduler
Scheduler是一系列动作的集合（action的集合）
* schedule发起一个action
* flush清空actions，action执行execute
* schedule的内部（action的work）可以继续schedule

### Action
* Scheduler的执行单元，有schedule发起
* Subscription的子类
* 发起异步请求
* 在action的schedule中可以继续schedule，可以节省资源