import { Scheduler } from '../Scheduler'
export const isScheduler = val => {
  return val != null && val instanceof Scheduler
}
