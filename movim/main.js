const windowStateKeeper = require('electron-window-state');
const {app, BrowserWindow, Menu, MenuItem, shell, ipcMain} = require('electron');
const path = require('path');
const os = require('os');

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

    mainWindow.setMenuBarVisibility(false);

    if (os.platform() === 'darwin') {
        var template = [{
            label: "Application",
            submenu: [
                { label: "About Movim", selector: "orderFrontStandardAboutPanel:" },
                { type: "separator" },
                { label: "Quit", accelerator: "CmdOrCtrl+Q", click: function() { app.quit(); }}
            ]}, {
            label: "Edit",
            submenu: [
                { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
                { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
                { type: "separator" },
                { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
            ]}
        ];
        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    }


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
            win.setMenuBarVisibility(false);
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
