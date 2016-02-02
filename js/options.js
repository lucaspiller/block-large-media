function saveOptions() {
  var maximumSize = parseInt(document.getElementById('maximumSize').value, 10)
  console.log('new maximum', maximumSize)
  chrome.storage.local.set({
    maximumSize: maximumSize
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status')
    status.textContent = 'Options saved.'
    setTimeout(function() {
      status.textContent = ''
    }, 1000)
  })
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  console.log('restoreOptions')
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get({
    maximumSize: 100,
  }, function(items) {
    console.log(items)
    document.getElementById('maximumSize').value = items.maximumSize
  })
}
document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
console.log('options.js!')
