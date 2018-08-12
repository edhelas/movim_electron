const windowStateKeeper = require('electron-window-state');
const {app, BrowserWindow, Menu, MenuItem} = require('electron');

var mainWindow = null;

require('electron-context-menu')({
    prepend: (params, browserWindow) => [{
        label: 'Movim',
        // only show it when right-clicking images
        visible: params.mediaType === 'image'
    }],
    showInspectElement: false
});

app.commandLine.appendSwitch('force-color-profile', 'srgb');

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Set default dimensions if a previous state isn't available
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1280,
        defaultHeight: 768
    });

    // Create the browser window.
    mainWindow = new BrowserWindow(
        {
            "x": mainWindowState.x,
            "y": mainWindowState.y,
            "width": mainWindowState.width,
            "height": mainWindowState.height,
            /*"minWidth": 1152,*/
            "minHeight": 600,
            backgroundColor: '#3F51B5',
            icon: __dirname + '/img/logo.png',
            "webPreferences": {
                "zoomFactor": 0.975,
                "allowDisplayingInsecureContent": true
            }
        }
    );
    mainWindowState.manage(mainWindow);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

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

    /*
    var appIcon = new Tray(__dirname + '/img/logo_tray.png');
    appIcon.setToolTip('Movim - Kickass Social Network');

    appIcon.on('clicked', function() {
        //if(mainWindow.isVisible()) {
        //    mainWindow.hide();
        //else {
            mainWindow.show();
        //}
    });*/

    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        if(url.search('/?visio/') > -1) {
            var win = new BrowserWindow()
            win.setMenuBarVisibility(false)
            win.loadURL(url)
            win.on('closed', function() {
                win = null;
            });
        } else {
            require('electron').shell.openExternal(url);
        }
    });

    mainWindow.notification = function(counter) {
        app.setBadgeCount(counter);
        if(counter > 0) {
            if(app.dock) {
                app.dock.bounce();
            }
            //appIcon.setImage(__dirname + '/img/logo_tray_notifs.png');
        } else {
            //appIcon.setImage(__dirname + '/img/logo_tray.png');
        }
    }
});
