const fs = require('fs');
const ipcRenderer = require('electron').ipcRenderer;
const showdown  = require('showdown');
require('showdown-table');

function getCollectionByKey(key) {
  let rawdata = fs.readFileSync('config.json');
  let config = JSON.parse(rawdata);
  let result = {}
  config.collections.forEach(function(collection) {
    if (collection.key == key) result = collection;
  });
  return result;
}

function setMarkdown(md) {
  var conv = new showdown.Converter({
    'tables' : true, 
    'ghCodeBlocks' : true
  });
  html = conv.makeHtml(md);
  console.log(md);
  document.getElementById('markdown').innerHTML = html;
}

function addDocument(doc) {
  var link = document.createElement('a');
  var item = document.createElement('li').appendChild(link);
  link.innerHTML = doc.title + '<i class="fas fa-angle-right"></i>';
  var markdown = doc.content.split("\\n").join("\n")
  link.onclick = (function(){
    setMarkdown(markdown);
  });
  document.getElementById('list').appendChild(item);
}

ipcRenderer.on('retrieved-documents', function(event, documents) {
  documents.forEach(function(doc) {
    addDocument(doc);
  });
});

function setTitle(title) {
  document.getElementById('title').innerHTML = `<span>Witness <i class="fas fa-angle-double-right"></i> Collections <i class="fas fa-angle-double-right"></i> ${title}</span>`
}

var col_key = (new URLSearchParams(window.location.search)).get('col');
var collection = getCollectionByKey(col_key);
if (collection != {}) {
  setTitle(collection.title);
  ipcRenderer.send('get-documents', { key: collection.key });
}