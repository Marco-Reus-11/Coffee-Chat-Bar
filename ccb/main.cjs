const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const VITE_DEV_SERVER_URL = 'http://localhost:5173';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    resizable: false,
    icon: path.join(__dirname, 'public', 'images', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 完全移除菜单栏
  Menu.setApplicationMenu(null);

  // 加载开发服务器
  win.loadURL(VITE_DEV_SERVER_URL);

  // 保险起见，再调用一次
  win.setMenuBarVisibility(false);

  //打开开发者工具
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
