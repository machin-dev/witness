// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})



// In main process.
//const { ipcMain } = require('electron')
//ipcMain.on('asynchronous-message', (event, arg) => {
//  console.log(arg) // prints "ping"
//  event.reply('asynchronous-reply', 'pong')
//})
//
//ipcMain.on('synchronous-message', (event, arg) => {
//  console.log(arg) // prints "ping"
//  event.returnValue = 'pong'
//})