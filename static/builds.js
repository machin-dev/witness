const fs = require('fs');
const ipcRenderer = require('electron').ipcRenderer;

function addBuild(build) {
    var test = document.createElement('p');
    test.innerHTML = build.title;
    document.getElementById('builds').appendChild(test);
}

ipcRenderer.on('retrieved-builds', function(event, builds) {
    builds.forEach(function(build) {
      addBuild(build);
    });
  });

ipcRenderer.send('get-builds');