import { observable, iterator } from '../../src/symbol'
import { getRxTestScheduler } from './helpers/marble-testing'
global.rxTestScheduler = getRxTestScheduler()
Symbol.observable = observable
if (!Symbol.iterator) {
  Symbol.iterator = iterator
}
