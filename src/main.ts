import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';

const createWindow = (): void => {
    let win = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true
      }
    });
    console.log(isDev);
    win.loadURL(
      isDev
        ? 'http://localhost:9000'
        : `file://${app.getAppPath()}/index.html`,
    );
  }
  
  app.on('ready', createWindow);
