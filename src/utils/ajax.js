/* eslint-disable */
import { makeMap } from './makeMap'
const methodMap = makeMap('OPTIONS,GET,HEAD,POST,PUT,DELETE,TRACE,CONNECT')
export function ajax(options = {}) {
  const {
    url,
    data = null,
    header = {},
    method = 'GET',
    dataType = 'json',
    responseType
  } = options
  if (!methodMap(method)) throw new Error('method error')
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest()
    xhr.onload = function() {
      var data = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
        body: 'response' in xhr ? xhr.response : xhr.responseText
      }
      resolve(data)
    }

    xhr.onerror = function() {
      reject(new Error('error'))
    }

    xhr.ontimeout = function() {
      reject(new Error('timeout'))
    }

    xhr.open(method, url, true)

    for (let key in header) {
      xhr.setRequestHeader(key, header[key])
    }

    if (responseType) {
      xhr.responseType = responseType
    }

    xhr.send(data)
  })
}

function parseHeaders(rawHeaders) {
  return rawHeaders
}
