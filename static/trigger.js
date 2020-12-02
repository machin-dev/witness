const ipcRenderer = require('electron').ipcRenderer;

function testMd() {
  console.log('TestMd');
  ipcRenderer.send('test-md');
}

ipcRenderer.on('apply-md', function(event, html) {
  document.getElementById('markdown-box').innerHTML = html;
});