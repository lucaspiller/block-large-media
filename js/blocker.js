var maximumSize = 100000 // 100kb

function beforeSendHeadersCallback(details) {
  var setRangeHeaders = true

  // check to make sure the range headers aren't already set, if they
  // are don't modify them
  for (var i = 0; i < details.requestHeaders.length; ++i) {
    if (details.requestHeaders[i].name === 'Range') {
      setRangeHeaders = false
      break
    }
  }

  // if they haven't been set already, set the range
  if (setRangeHeaders) {
    details.requestHeaders.push({
      name: 'Range',
      value: 'bytes=0-' + (maximumSize - 1).toString()
    })
  }

  return {requestHeaders: details.requestHeaders}
}

function headersReceivedCallback(details) {
  var contentLength = undefined

  // Look for the Content-Length header, but it may be optional
  for (var i = 0; i < details.responseHeaders.length; ++i) {
    if (details.responseHeaders[i].name === 'Content-Length') {
      contentLength = parseInt(details.responseHeaders[i].value, 10)
    }
  }

  // If we didn't get the length, check the status code. The spec says we
  // should get 203 Partial Content
  if (contentLength == undefined) {
    if (details.statusCode == 206) {
      // Assume the server is being truthful...
      return {cancel: false}
    } else {
      // Block that 40mb GIF!
      return {cancel: true}
    }
  } else {
    if (contentLength <= maximumSize) {
      // Yaye, we got what we asked for!
      return {cancel: false}
    } else {
      // Block that 40mb GIF!
      return {cancel: true}
    }
  }

}

function readSettings() {
  chrome.storage.local.get({
    maximumSize: 100,
  }, function(items) {
    maximumSize = items.maximumSize * 1000
    console.log('Maximum size is ', maximumSize, 'bytes')
  })
}

function setup() {
  chrome.storage.onChanged.addListener(
    readSettings
  )

  readSettings()

  chrome.webRequest.onBeforeSendHeaders.addListener(
    beforeSendHeadersCallback,
    { urls: ["<all_urls>"], types: ['image'] },
    ["blocking", "requestHeaders"]
  )

  chrome.webRequest.onHeadersReceived.addListener(
    headersReceivedCallback,
    { urls: ["<all_urls>"], types: ['image'] },
    ["blocking", "responseHeaders"]
  )
}

chrome.runtime.onInstalled.addListener(setup)
console.log("Large media active")
