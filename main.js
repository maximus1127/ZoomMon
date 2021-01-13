const { app, BrowserWindow, Tray, Menu } = require('electron')
var ipcMain = require('electron').ipcMain;
const Store = require('electron-store');
const store = new Store();
const fs = require('fs');

shouldScan = true;

// global window declaration function
var win;
async function createWindow () {
    win = new BrowserWindow({
    width: 500,
    height: 250,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  })
  win.setMenuBarVisibility(false)
  win.loadFile('index.html')

  tray = new Tray('spongebob.ico')
  const contextMenu = Menu.buildFromTemplate([
    {
             label: 'Show App', click: function () {
                 win.show()
             }
         },
         {
             label: 'Quit', click: function () {
                 app.isQuiting = true
                 app.quit()
             }
         }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)

  win.on('minimize', function (event) {
    event.preventDefault()
    shouldScan = true
    scanning()
    win.hide()
})

win.on('show', function (event) {
  event.preventDefault()
  shouldScan = false
})
await sleep(1000)
win.minimize()
}

// start the application
app.whenReady().then(createWindow)

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




//allow delays
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


//check the designated folder and stop the loop while showing the app window from the tray
async function scanning(){
  while(shouldScan){
    console.log('scanning')
    if(store.get('default_path') != null){
      files = fs.readdirSync(store.get('default_path'));
      if(files.length > 0){
        fs.rename(store.get('default_path') + "/" + files[0], store.get('default_path') + "/encounter", err => {
        if (err) {
          console.error(err)
          return
        }
        })
        console.log('should have shown')
        win.show()
        shouldScan = false
    }
  }
    await sleep(1000)
  }
}

//start the scanning funciton again when the signal is received
ipcMain.on('processInput', function(event, status) {
  win.hide()
  shouldScan = true
  scanning()
});
