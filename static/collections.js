const fs = require('fs');

// <div>
//   <span><i class="fas fa-hdd"></i><br>Local Docs</span>
//   <a href="/">Installation</a>
//   <a href="/">AWS</a>
//   <a href="/">Read more</a>
// </div>

function addCollectionPanel(collection) {
  var span = document.createElement('span');
  span.innerHTML = '<i class="' + collection.icon + '"></i><br>' + collection.title;
  var link = document.createElement('a');
  link.innerHTML = 'Read More';
  link.onclick = (function(){
    window.location.replace(`documents.html?col=${collection.key}`);
  });
  var div  = document.createElement('div');
  div.appendChild(span);
  div.appendChild(link);
  document.getElementById('collections').appendChild(div);
}

function getCollections() {
  let rawdata = fs.readFileSync('config.json');
  let config = JSON.parse(rawdata);
  config.collections.forEach(function(collection) {
    addCollectionPanel(collection);
  });
}

getCollections();