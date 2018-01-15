let id = 0
const cache = {}
export const setImmediate = cb => {
  id++
  cache[id] = cb
  Promise.resolve().then(() => {
    const handle = cache[id]
    if (handle) {
      handle()
    }
  })

  return id
}

export const clearImmediate = id => {
  delete cache[id]
}
