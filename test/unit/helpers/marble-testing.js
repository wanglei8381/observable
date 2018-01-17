import { TestScheduler } from '@/testing/TestScheduler'
export function hot (...args) {
  return global.rxTestScheduler.createHotObservable(...args)
}

export function cold (...args) {
  return global.rxTestScheduler.createColdObservable(...args)
}

export function expectObservable (observable, unsubscriptionMarbles = null) {
  const res = global.rxTestScheduler.expectObservable(
    observable,
    unsubscriptionMarbles
  )
  return {
    toBe (...args) {
      res.toBe(...args)
      try {
        global.rxTestScheduler.flush()
      } finally {
        global.rxTestScheduler = getRxTestScheduler()
      }
    }
  }
}

export function getRxTestScheduler () {
  return new TestScheduler(function (actual, expected) {
    if (Array.isArray(actual) && Array.isArray(expected)) {
      expect(actual.length).toBe(expected.length)
      actual = actual.map(deleteErrorNotificationStack)
      expected = expected.map(deleteErrorNotificationStack)
      expect(actual).toEqual(expected)
    } else {
      expect(actual).toBe(expected)
    }
  })
}

function deleteErrorNotificationStack (marble) {
  const { notification } = marble
  if (notification) {
    const { kind, error } = notification
    if (kind === 'E' && error instanceof Error) {
      notification.error = { name: error.name, message: error.message }
    }
  }
  return marble
}
