const windowStateKeeper = require('electron-window-state');
const {app, BrowserWindow, Menu, MenuItem, shell, ipcMain} = require('electron');
const path = require('path');

var mainWindow = null;

require('electron-context-menu')({
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
            backgroundColor: '#3F51B5',
            icon: path.join(__dirname, 'img/logo.png'),
            "webPreferences": {
                "allowDisplayingInsecureContent": true, // TODO: make it configurable
                "preload": path.join(__dirname, 'browser.js'),
                "nodeIntegration": false,
                "sandbox": true
            }
        }
    );
    mainWindowState.manage(mainWindow);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    //mainWindow.openDevTools();

    var menuDef = [
        { label: 'File', submenu: [ { role: 'quit' } ] },
        { role: 'editMenu' },
        { label: 'View', submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'toggleFullscreen' }
        ] },
        { role: 'windowMenu' }
    ];
    if (process.platform == 'darwin') {
        menuDef[0] = {
            label: 'Application',
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services', submenu: [] },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        };
        menuDef[2].submenu.push(
            { type: 'separator' },
            {
                label: 'Speech',
                submenu: [
                    { role: 'startspeaking' },
                    { role: 'stopspeaking' }
                ]
            }
        );
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuDef));
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    app.on('activate', function(event) {
         mainWindow.show();
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
            var win = new BrowserWindow(
                {
                    "webPreferences": {
                        "allowDisplayingInsecureContent": true, // TODO: make it configurable
                        "preload": path.join(__dirname, 'browser.js'),
                        "nodeIntegration": false,
                        "sandbox": true
                    }
                }
            );
            win.setMenu(null);
            win.loadURL(url);
            win.on('closed', function() {
                win = null;
            });
        } else if (url.search('/?popuptest') == -1) {
            shell.openExternal(url);
        }
    });

    ipcMain.on('open-external', function(event, url) {
        shell.openExternal(url);
    });

    ipcMain.on('notification',  function(event, counter) {
        app.setBadgeCount(counter);
        if(counter > 0) {
            if(app.dock) {
                app.dock.bounce();
            }
            //appIcon.setImage(__dirname + '/img/logo_tray_notifs.png');
        } else {
            //appIcon.setImage(__dirname + '/img/logo_tray.png');
        }
    });

});
