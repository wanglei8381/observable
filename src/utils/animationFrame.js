/* eslint-disable no-undef */
let lastTime = 0

// 之所以一个一个枚举是因为不能用上下文（微信小程序）
function AnimationFrame () {
  let raf
  let caf
  if (typeof requestAnimationFrame !== 'undefined') {
    raf = requestAnimationFrame
    caf = cancelAnimationFrame
  } else if (typeof webkitRequestAnimationFrame !== 'undefined') {
    raf = webkitRequestAnimationFrame
    caf = webkitCancelAnimationFrame
  } else if (typeof msRequestAnimationFrame !== 'undefined') {
    raf = msRequestAnimationFrame
    caf = msCancelAnimationFrame
  } else if (typeof mozRequestAnimationFrame !== 'undefined') {
    raf = mozRequestAnimationFrame
    caf = mozCancelAnimationFrame
  } else if (typeof oRequestAnimationFrame !== 'undefined') {
    raf = oRequestAnimationFrame
    caf = oCancelAnimationFrame
  } else {
    raf = function (callback) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))
      var id = setTimeout(function () {
        /* eslint-disable standard/no-callback-literal */
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
    caf = clearTimeout
  }
  return {
    raf,
    caf
  }
}

const { raf, caf } = AnimationFrame()
export const requestAnimationFrame = raf
export const cancelAnimationFrame = caf
