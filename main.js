var app = require('app');  // Module to control application life.
var Tray = require('tray');
var Menu = require('menu');

var BrowserWindow = require('browser-window');  // Module to create native browser window.

var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

var appIcon = null;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow(
        {
            width: 1280, 
            height: 768, 
            "min-width": 1152,
            "min-height": 768, 
            icon: __dirname + '/img/logo.png',
            "web-preferences": {
                "allow-displaying-insecure-content": true
            }
        }
    );

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.setMenuBarVisibility(false);

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    var appIcon = new Tray(__dirname + '/img/logo_cloud.png');
});