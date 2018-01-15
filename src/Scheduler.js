export class Scheduler {
  constructor (SchedulerAction, now = Scheduler.now) {
    this.SchedulerAction = SchedulerAction
    this.now = now
  }

  // schedule是所有异步的入口，接受三个参数
  // work: 需要执行的任务，delay：延迟多长时间执行，state：交给work的状态
  // 每schedule一次都会生成一个action，action是Scheduler的执行单元
  schedule (work, delay = 0, state) {
    return new this.SchedulerAction(this, work).schedule(state, delay)
  }

  static now = Date.now
}
