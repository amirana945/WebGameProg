const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        fullscreen: false,
        fullscreenable: false,
        height: /*[[DEFAULT_GAME_HEIGHT*/500/*DEFAULT_GAME_HEIGHT]]*/, 
        maximizable: false,
        resizeable: false,
        show: false,
        useContentSize: true,
        width: /*[[DEFAULT_GAME_WIDTH*/800/*DEFAULT_GAME_WIDTH]]*/ 
    });

    mainWindow.once('ready-to-show', function() {
        mainWindow.show();
    });

    // load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/dist/index.html');

    mainWindow.on('closed', function () {

        mainWindow = null;
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {

    if (mainWindow === null) {
        createWindow();
    }
});
