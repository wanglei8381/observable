import { Scheduler } from '@'
import sinon from 'sinon'
const asap = Scheduler.asap

describe('Scheduler.asap', () => {
  it('should exist', function () {
    expect(asap).not.toBeUndefined()
  })

  it('should act like the async scheduler if delay > 0', function () {
    var actionHappened = false
    var sandbox = sinon.sandbox.create()
    var fakeTimer = sandbox.useFakeTimers()
    asap.schedule(function () {
      actionHappened = true
    }, 50)
    expect(actionHappened).toBeFalsy()
    fakeTimer.tick(25)
    expect(actionHappened).toBeFalsy()
    fakeTimer.tick(25)
    expect(actionHappened).toBeTruthy()
    sandbox.restore()
  })

  it('should schedule an action to happen later', done => {
    var actionHappened = false
    asap.schedule(function () {
      actionHappened = true
      done()
    })
    if (actionHappened) {
      done(new Error('Scheduled action happened synchronously'))
    }
  })

  it('should execute recursively scheduled actions in separate asynchronous contexts', function (done) {
    var syncExec1 = true
    var syncExec2 = true
    asap.schedule(
      function (index) {
        if (index === 0) {
          this.schedule(1)
          asap.schedule(function () {
            syncExec1 = false
          })
        } else if (index === 1) {
          this.schedule(2)
          asap.schedule(function () {
            syncExec2 = false
          })
        } else if (index === 2) {
          this.schedule(3)
        } else if (index === 3) {
          if (!syncExec1 && !syncExec2) {
            done()
          } else {
            done(new Error('Execution happened synchronously.'))
          }
        }
      },
      0,
      0
    )
  })

  it('should cancel the animation frame if all scheduled actions unsubscribe before it executes', function (done) {
    var animationFrameExec1 = false
    var animationFrameExec2 = false
    var action1 = asap.schedule(function () {
      animationFrameExec1 = true
    })
    var action2 = asap.schedule(function () {
      animationFrameExec2 = true
    })
    expect(asap.scheduled).not.toBeUndefined()
    expect(asap.actions.length).toBe(2)
    action1.unsubscribe()
    action2.unsubscribe()
    expect(asap.actions.length).toBe(0)
    expect(asap.scheduled).toBeUndefined()
    asap.schedule(function () {
      expect(animationFrameExec1).toBe(false)
      expect(animationFrameExec2).toBe(false)
      done()
    })
  })

  it('should execute the rest of the scheduled actions if the first action is canceled', function (done) {
    var actionHappened = false
    var firstSubscription = null
    var secondSubscription = null
    firstSubscription = asap.schedule(function () {
      actionHappened = true
      if (secondSubscription) {
        secondSubscription.unsubscribe()
      }
      done(new Error('The first action should not have executed.'))
    })
    secondSubscription = asap.schedule(function () {
      if (!actionHappened) {
        done()
      }
    })
    if (actionHappened) {
      done(new Error('Scheduled action happened synchronously'))
    } else {
      firstSubscription.unsubscribe()
    }
  })
})
