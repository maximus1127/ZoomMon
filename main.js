"use strict";
const path = require('path');
const {app, nativeImage, Tray, Menu, BrowserWindow,ipcMain} = require("electron");
const Store = require('electron-store');
const chokidar = require('chokidar');
const store = new Store();

let monitoredFolder = "/Users/jasper/Desktop/test";
const watcher = chokidar.watch(monitoredFolder, { persistent: true });

let config = {};


app.once("ready", ev => {
    config.win = new BrowserWindow({
        width: 500, height: 250, center: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: true, 
            webSecurity: true,
            sandbox: true,
        },                                
    });
    // win.setMenuBarVisibility(false)
    config.win.loadFile("index.html");
    config.win.on("close", ev => {
        ev.sender.hide();
        ev.preventDefault(); 
    });

    config.tray = new Tray(path.join(__dirname, 'asset','img', 'icon_16x16.png'));
    const menu = Menu.buildFromTemplate([
            {label: "ShowApp", click: (item, window, event) => {
                config.win.show();
            }},

        {type: "separator"},
        {role: "quit"}, 
    ]);

    config.tray.setToolTip("This is my application.");
    config.tray.setTitle("ZoomMon"); // macOS only
    config.tray.setContextMenu(menu);

    watcher
    .on('add', path => console.log(`File ${path} has been added`))
    .on('addDir', path => {
      console.log(`Directory ${path} has been added`)
      config.win.show()
    });

});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


app.on("before-quit", ev => {
    config.win.removeAllListeners("close");
    config = null;
});










