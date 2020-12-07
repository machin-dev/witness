// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const firebase = require('firebase');
const fs = require('fs');
const showdown  = require('showdown');
// Required for side-effects
require('firebase/auth');
require('firebase/firestore');

let mainWindow, splash, config;

function createWindow () {
  // Retrieve config
  let rawdata = fs.readFileSync('config.json');
  config = JSON.parse(rawdata);
  // Initialize Firebase
  rawdata = fs.readFileSync('static/firebase.json');
  var firebaseConfig = JSON.parse(rawdata);
	firebase.initializeApp(firebaseConfig);
  firestore = firebase.firestore();
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    titleBarStyle: 'hidden',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false
    }
  });

  splash = new BrowserWindow({width: 200, height: 200, transparent: true, frame: false, alwaysOnTop: true});
  splash.loadURL(`file://${__dirname}/splash.html`);
  mainWindow.loadURL(`file://${__dirname}/${config.settings.homepage}`);

  // if main window is ready to show, then destroy the splash window and show up the main window
  async function closeSplash() {
    await sleep(config.settings.splash_duration);
    splash.destroy();
    mainWindow.show();
  };

  mainWindow.once('ready-to-show', () => {
    closeSplash();
  });

  // Open the DevTools.
  mainWindow.removeMenu();
  mainWindow.webContents.openDevTools();

  // Set flag on close
  mainWindow.on('closed', function () {
    appClosed = true;
  });

//  // Get Firestore information
//  var email = config.credentials.email;
//  var password = config.credentials.password;
//
//  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
//    config.collections.forEach(function(collection) {
//      firebase.firestore().collection(collection.key).onSnapshot(function(snapshot) {
//        console.log("Collection: ", collection.title);
//        snapshot.forEach(function(doc) {
//          console.log("Current data: ", doc.data());
//        });
//      });
//    });
//  }).catch(function(error) {
//    console.log(error.code, error.message);
//  });
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

ipcMain.on('get-documents', function(event, arg) {
  var email = config.credentials.email;
  var password = config.credentials.password;
  var documents = [];
  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    firebase.firestore().collection(arg.key).onSnapshot(function(snapshot) {
      snapshot.forEach(function(doc) {
        documents.push(doc.data());
      });
      event.sender.send('retrieved-documents', documents);
    });
  }).catch(function(error) {
    console.log(error.code, error.message);
  });
});

ipcMain.on('get-builds', function(event, arg) {
  var email = config.credentials.email;
  var password = config.credentials.password;
  var builds = [];
  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    firebase.firestore().collection('builds').onSnapshot(function(snapshot) {
      snapshot.forEach(function(build) {
        builds.push(build.data());
      });
      event.sender.send('retrieved-builds', builds);
    });
  }).catch(function(error) {
    console.log(error.code, error.message);
  });
});