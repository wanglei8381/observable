export class _Set {
  constructor () {
    this.set = Object.create(null)
  }

  add (key) {
    this.set[key] = true
  }

  delete (key) {
    if (this.has(key)) {
      delete this.set[key]
    }
  }

  has (key) {
    return this.set[key] === true
  }

  clear () {
    this.set = Object.create(null)
  }
}
