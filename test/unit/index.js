import {
  cold,
  hot,
  expectObservable,
  expectSubscriptions
} from './helpers/marble-testing'
global.cold = cold
global.hot = hot
global.expectObservable = expectObservable
global.expectSubscriptions = expectSubscriptions
global.expect.extend({
  toBeType (received, argument) {
    const initialType = typeof received
    const type =
      initialType === 'object'
        ? Array.isArray(received) ? 'array' : initialType
        : initialType
    return type === argument
      ? {
        message: () => `expected ${received} to be type ${argument}`,
        pass: true
      }
      : {
        message: () => `expected ${received} to be type ${argument}`,
        pass: false
      }
  }
})
