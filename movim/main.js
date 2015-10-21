var app = require('app');  // Module to control application life.
var Tray = require('tray');
var Menu = require('menu');
var ipc = require('ipc');

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
                "zoom-factor": 0.975,
                "allow-displaying-insecure-content": true
            }
        }
    );

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    //mainWindow.openDevTools();

    mainWindow.setMenuBarVisibility(false);

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    /*
    mainWindow.on('blur', function() {
        console.log('blur');
        mainWindow.blurWebView();
    });

    mainWindow.on('focus', function() {
        console.log('focus');
        mainWindow.focusOnWebView();
    });*/

    var appIcon = new Tray(__dirname + '/img/logo_tray.png');
    appIcon.setToolTip('Movim - Kickass Social Network');

    appIcon.on('clicked', function() {
        //if(mainWindow.isVisible()) {
        //    mainWindow.hide();
        //else {
            mainWindow.show();
        //}
    });

    mainWindow.notification = function(counter) {
        if(counter > 0) {
            if(app.dock) {
                app.dock.bounce();
                app.dock.setBadge(counter);
            }
            appIcon.setImage(__dirname + '/img/logo_tray_notifs.png');
        } else {
            appIcon.setImage(__dirname + '/img/logo_tray.png');
        }
    }
});
