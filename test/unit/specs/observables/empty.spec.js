import { Observable } from '@'

describe('Observable.empty', function () {
  it('should create a cold observable with only complete', function () {
    var expected = '|'
    var e1 = Observable.empty()
    expectObservable(e1).toBe(expected)
  })
})
