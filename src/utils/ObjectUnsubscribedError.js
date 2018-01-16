export class ObjectUnsubscribedError extends Error {
  constructor () {
    super('object unsubscribed')
    this.name = 'ObjectUnsubscribedError'
    Object.setPrototypeOf(this, ObjectUnsubscribedError.prototype)
  }
}

export const throwObjectUnsubscribedError = () => {
  throw new ObjectUnsubscribedError()
}
