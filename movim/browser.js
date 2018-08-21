const {ipcRenderer} = require('electron');

window.electron = {
    openExternal: function(url) {
        if (url) {
            ipcRenderer.send('open-external', url);
        }
    },
    notification: function(counter) {
        ipcRenderer.send('notification', ~~counter);
    }
};

// shim for old Movim pods
window.require = function(str) {
    return {
        shell: {
            openExternal: function(url) {
                window.electron.openExternal(url);
            }
        },
        remote: {
            getCurrentWindow: function() {
                return {
                    notification: function(counter) {
                        window.electron.notification(counter);
                    }
                }
            }
        }
    };
};
